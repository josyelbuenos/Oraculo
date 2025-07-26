import os
import platform
import webbrowser
import requests
import getpass

# Função para limpar o terminal conforme o sistema operacional
def clear_terminal():
    system = platform.system().lower()
    # Detecta Termux (Android) por variável de ambiente
    if 'ANDROID_ROOT' in os.environ or 'termux' in os.environ.get('PREFIX', '').lower():
        os.system('clear')
    elif 'windows' in system:
        os.system('cls')
    else:
        os.system('clear')

WEB_DIR = 'web'
NODE_MODULES = os.path.join(WEB_DIR, 'node_modules')
ENV_PATH = os.path.join(WEB_DIR, '.env')
API_URL = 'https://oraculo-api-enso.onrender.com/usuario-por-senha/'

# Função para verificar se node_modules existe
def check_node_modules():
    return os.path.exists(NODE_MODULES)

# Função para instalar dependências
def install_dependencies():
    os.system(f'cd {WEB_DIR} && npm install && npm install -g next')

# Função para verificar se .env está preenchido
def is_env_filled():
    if not os.path.exists(ENV_PATH):
        return False
    keys = {'GEMINI_API_KEY': '', 'API_USER': '', 'API_PASSWORD': ''}
    with open(ENV_PATH, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            for key in keys:
                if line.startswith(key + '='):
                    value = line[len(key)+1:].strip()
                    keys[key] = value
    # Verifica se todos os campos estão preenchidos
    return all(keys[k] for k in keys)

# Função para preencher .env
def fill_env(usuario, gemini_key, senha):
    # Cria o arquivo .env se não existir e preenche com os dados
    with open(ENV_PATH, 'w', encoding='utf-8') as f:
        f.write(f'GEMINI_API_KEY={gemini_key}\nAPI_USER={usuario}\nAPI_PASSWORD={senha}\n')

# Função para autenticar usuário
def authenticate(senha):
    try:
        url = API_URL + str(senha)
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            return data, data.get('usuario'), data.get('gemini_key')
        else:
            return {'erro': response.text}, None, None
    except Exception as e:
        return {'excecao': str(e)}, None, None


def main_menu():
    # Cores ANSI
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'


    import datetime
    import socket
    import time

    # Tenta ler usuário do .env
    usuario = 'Usuário'
    try:
        with open(ENV_PATH, 'r', encoding='utf-8') as f:
            for line in f:
                if line.startswith('API_USER='):
                    usuario = line.split('=',1)[1].strip() or 'Usuário'
    except Exception:
        pass

    # Verificação automática de versão
    try:
        with open('version', 'r', encoding='utf-8') as f:
            local_version = f.read().strip()
        remote_url = 'https://raw.githubusercontent.com/josyelbuenos/Oraculo/main/version'
        remote_version = requests.get(remote_url, timeout=5).text.strip()
        def version_tuple(v):
            return tuple(map(int, v.split('.')))
        if version_tuple(remote_version) > version_tuple(local_version):
            print(f"\033[93m{'='*40}\033[0m")
            print(f"\033[91m\033[1mNova versão disponível: {remote_version} (atual: {local_version})\033[0m")
            print(f"\033[93mDeseja atualizar agora? (s/n)\033[0m")
            escolha = input().strip().lower()
            if escolha == 's':
                print(f"\033[96mBaixando e atualizando arquivos...\033[0m")
                import subprocess
                # Clona o repositório em uma pasta temporária
                temp_dir = '__oraculo_update_temp__'
                if os.path.exists(temp_dir):
                    import shutil
                    shutil.rmtree(temp_dir)
                subprocess.run(f'git clone https://github.com/josyelbuenos/Oraculo.git {temp_dir}', shell=True)
                # Copia todos os arquivos para o diretório atual
                import shutil
                for item in os.listdir(temp_dir):
                    s = os.path.join(temp_dir, item)
                    d = os.path.join(os.getcwd(), item)
                    if os.path.isdir(s):
                        if os.path.exists(d):
                            shutil.rmtree(d)
                        shutil.copytree(s, d)
                    else:
                        shutil.copy2(s, d)
                shutil.rmtree(temp_dir)
                print(f"\033[92mAtualização concluída! Reinicie o programa.\033[0m")
                exit()
    except Exception as e:
        print(f"\033[91mErro ao verificar atualização: {e}\033[0m")

    # Informações do sistema
    os_name = platform.system()
    os_release = platform.release()
    arch = platform.machine()
    hostname = socket.gethostname()
    now = datetime.datetime.now().strftime('%d/%m/%Y %H:%M:%S')
    # Latência simulada (pode ser real se quiser)
    start = time.time()
    time.sleep(0.05)
    latency = int((time.time()-start)*1000)

    logo = rf"""
{OKCYAN}{BOLD}
____ ____ ____ ____ _  _ _    ____ 
|  | |__/ |__| |    |  | |    |  | 
|__| |  \ |  | |___ |__| |___ |__| 
                                   
{ENDC}"""

    header = (
        f"{HEADER}{'='*40}{ENDC}\n"
        f"{OKGREEN}{BOLD}Bem-vindo, {usuario}!{ENDC}\n"
        f"{OKCYAN}Data/Hora: {now}{ENDC}\n"
        f"{OKCYAN}Dispositivo: {hostname}{ENDC}\n"
        f"{OKCYAN}Arquitetura: {arch}{ENDC}\n"
        f"{OKCYAN}Sistema Operacional: {os_name} {os_release}{ENDC}\n"
        f"{OKCYAN}Latência: {latency} ms{ENDC}\n"
        f"{HEADER}{'='*40}{ENDC}\n"
    )

    while True:
        clear_terminal()
        print('\n' + logo)
        print(header)
        print(f"{OKGREEN}{BOLD}{' Oráculo - Gerenciador Web ':^40}{ENDC}")
        print(f"{HEADER}{'='*40}{ENDC}")
        print(f"{OKBLUE}1{ENDC} - Iniciar Aplicação")
        print(f"{OKBLUE}2{ENDC} - Verificar Atualização")
        print(f"{OKBLUE}3{ENDC} - Reinstalar Dependências")
        print(f"{OKBLUE}4{ENDC} - Sair")
        print(f"{HEADER}{'='*40}{ENDC}")
        escolha = input(f"{BOLD}Escolha uma opção:{ENDC} ").strip()
        clear_terminal()
        if escolha == '1':
            import subprocess
            import requests as req
            print(f"{OKCYAN}Iniciando aplicação...{ENDC}")
            print(f"{FAIL}Aguarde todo o processo ser concluído. O servidor ficará rodando até que você feche manualmente (Ctrl+C).{ENDC}")
            print(f"{OKGREEN}Acesse: http://localhost:9002{ENDC}")
            print(f"{OKCYAN}Logs do servidor abaixo:\n{ENDC}")
            proc = subprocess.Popen(
                "next dev",
                cwd=WEB_DIR,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                shell=True
            )
            try:
                for line in proc.stdout:
                    print(line, end="")
            except KeyboardInterrupt:
                print(f"\n{WARNING}Servidor interrompido pelo usuário.{ENDC}")
            proc.terminate()
            proc.wait()
            print(f"{WARNING}Servidor finalizado. Retornando ao menu...{ENDC}")
        elif escolha == '2':
            verificar_atualizacao()
        elif escolha == '3':
            print(f"{OKCYAN}Reinstalando dependências...{ENDC}")
            install_dependencies()
            print(f"{OKGREEN}Dependências reinstaladas com sucesso!{ENDC}")
        elif escolha == '4':
            print(f"{WARNING}Saindo...{ENDC}")
            break
        else:
            print(f"{FAIL}Opção inválida. Tente novamente.{ENDC}")
# Função para verificar atualização (placeholder)
def verificar_atualizacao():
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    ENDC = '\033[0m'
    print(f"{OKCYAN}Verificando atualizações...{ENDC}")
    try:
        with open('version', 'r', encoding='utf-8') as f:
            local_version = f.read().strip()
        remote_url = 'https://raw.githubusercontent.com/josyelbuenos/Oraculo/main/version'
        remote_version = requests.get(remote_url, timeout=5).text.strip()
        def version_tuple(v):
            return tuple(map(int, v.split('.')))
        if version_tuple(remote_version) > version_tuple(local_version):
            print(f"\033[93m{'='*40}\033[0m")
            print(f"\033[91m\033[1mNova versão disponível: {remote_version} (atual: {local_version})\033[0m")
            print(f"\033[93mDeseja atualizar agora? (s/n)\033[0m")
            escolha = input().strip().lower()
            if escolha == 's':
                print(f"\033[96mBaixando e atualizando arquivos...\033[0m")
                import subprocess
                temp_dir = '__oraculo_update_temp__'
                if os.path.exists(temp_dir):
                    import shutil
                    shutil.rmtree(temp_dir)
                subprocess.run(f'git clone https://github.com/josyelbuenos/Oraculo.git {temp_dir}', shell=True)
                import shutil
                for item in os.listdir(temp_dir):
                    s = os.path.join(temp_dir, item)
                    d = os.path.join(os.getcwd(), item)
                    if os.path.isdir(s):
                        if os.path.exists(d):
                            shutil.rmtree(d)
                        shutil.copytree(s, d)
                    else:
                        shutil.copy2(s, d)
                shutil.rmtree(temp_dir)
                print(f"\033[92mAtualização concluída! Reinicie o programa.\033[0m")
                exit()
        else:
            print(f"{OKGREEN}Nenhuma atualização disponível no momento.{ENDC}")
    except Exception as e:
        print(f"\033[91mErro ao verificar atualização: {e}\033[0m")


def login_screen():
    HEADER = '\033[95m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

    clear_terminal()
    print(f"\n{HEADER}{'='*40}{ENDC}")
    print(f"{OKCYAN}{BOLD}{' LOGIN ORÁCULO ':^40}{ENDC}")
    print(f"{HEADER}{'='*40}{ENDC}")
    senha = getpass.getpass(f"{BOLD}Digite sua senha:{ENDC} ")
    print(f"{OKCYAN}Autenticando, aguarde...{ENDC}")
    resposta, usuario, gemini_key = authenticate(senha)
    if usuario and gemini_key:
        # Garante que o diretório web existe
        if not os.path.exists(WEB_DIR):
            os.makedirs(WEB_DIR)
        # Cria ou atualiza o arquivo .env no diretório web
        fill_env(usuario, gemini_key, senha)
        print(f"{OKGREEN}Login realizado com sucesso!{ENDC}")
    else:
        print(f"{FAIL}Erro ao autenticar!{ENDC}")

if __name__ == '__main__':
    # Aviso de Termos de Responsabilidade
    print('\033[96m' + '='*50 + '\033[0m')
    print('\033[93mAo usar esta aplicação, você concorda com os Termos de Responsabilidade.\033[0m')
    print('Leia em: \033[94mhttps://github.com/josyelbuenos/Oraculo/blob/main/TERMS_OF_USE.md\033[0m')
    print('\033[96m' + '='*50 + '\033[0m')
    escolha = input('Você concorda com os termos? (s/n): ').strip().lower()
    if escolha != 's':
        print('\033[91mInstalação cancelada. Você deve aceitar os termos para usar o Oráculo.\033[0m')
        exit()
    if not check_node_modules():
        print('Instalando dependências do projeto...')
        install_dependencies()
    if not is_env_filled():
        login_screen()
    main_menu()
