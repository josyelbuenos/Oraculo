#!/data/data/com.termux/files/usr/bin/bash
# Oráculo - Instalador Automático para Termux
# --------------------------------------------
# Este script instala todos os requisitos do projeto Oráculo no Termux
# Autor: josyelbuenos

CYAN='\e[96m'
GREEN='\e[92m'
YELLOW='\e[93m'
RED='\e[91m'
BOLD='\e[1m'
RESET='\e[0m'

# Função para exibir cabeçalho decorado
print_header() {
  echo -e "${CYAN}${BOLD}"
  echo "============================================="
  echo "      Oráculo - Instalador Automático        "
  echo "============================================="
  echo -e "${RESET}"
}

print_header

draw_step() {
  echo -e "${CYAN}${BOLD}------------------------------${RESET}"
  echo -e "${YELLOW}${BOLD}$1${RESET}"
  echo -e "${CYAN}${BOLD}------------------------------${RESET}"
}

# Função para verificar e instalar pacotes
install_pkg() {
  PKG=$1
  if ! command -v $PKG >/dev/null 2>&1; then
    draw_step "Instalando $PKG..."
    pkg install $PKG -y
    echo -e "${GREEN}$PKG instalado com sucesso!${RESET}"
  else
    echo -e "${GREEN}$PKG já instalado!${RESET}"
  fi
}

draw_step "Verificando e instalando pacotes essenciais"
for PKG in python nodejs git; do
  install_pkg $PKG
  sleep 0.5
done

draw_step "Verificando o pip"
if ! command -v pip >/dev/null 2>&1; then
  echo -e "${YELLOW}Instalando pip...${RESET}"
  python -m ensurepip --upgrade
  echo -e "${GREEN}pip instalado com sucesso!${RESET}"
else
  echo -e "${GREEN}pip já instalado!${RESET}"
fi

draw_step "Instalando dependências Python"
if [ -f requirements.txt ]; then
  echo -e "${CYAN}Instalando dependências Python...${RESET}"
  pip install --upgrade pip
  pip install -r requirements.txt && echo -e "${GREEN}Dependências Python instaladas!${RESET}" || echo -e "${RED}Erro ao instalar dependências Python!${RESET}"
else
  echo -e "${RED}Arquivo requirements.txt não encontrado!${RESET}"
fi

draw_step "Instalando dependências Node.js"
if [ -f web/package.json ]; then
  echo -e "${CYAN}Instalando dependências Node.js...${RESET}"
  cd web && npm install && cd .. && echo -e "${GREEN}Dependências Node.js instaladas!${RESET}" || echo -e "${RED}Erro ao instalar dependências Node.js!${RESET}"
  npm install -g next
else
  echo -e "${RED}Arquivo web/package.json não encontrado!${RESET}"
fi

draw_step "Finalizando instalação"
sleep 0.5
echo -e "${GREEN}${BOLD}Instalação concluída! Você já pode usar o Oráculo.${RESET}"
echo -e "${CYAN}Para iniciar, execute:${RESET}"
echo -e "${BOLD}python menu.py${RESET}"
