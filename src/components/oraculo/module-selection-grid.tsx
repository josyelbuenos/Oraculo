
'use client';

import { motion } from 'framer-motion';
import { type QueryModule, type ModuleGroup, moduleGroups, getIconForModule } from '@/lib/modules';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ModuleSelectionGridProps {
  selectedGroup: ModuleGroup | null;
  onGroupSelect: (group: ModuleGroup) => void;
  onModuleSelect: (module: QueryModule) => void;
  onBack: () => void;
}

export function ModuleSelectionGrid({ 
  selectedGroup, 
  onGroupSelect,
  onModuleSelect,
  onBack
}: ModuleSelectionGridProps) {

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
  };

  const renderModuleCard = (
    module: QueryModule | ModuleGroup,
    onClick: () => void,
    isGroup: boolean
  ) => {
    const iconKey = isGroup ? (module as ModuleGroup).icon : (module as QueryModule).modulo;
    const label = isGroup ? (module as ModuleGroup).label : (module as QueryModule).modulo.toUpperCase();
    
    return (
      <motion.div
        key={module.id}
        variants={itemVariants}
        whileHover={{ scale: 1.05, zIndex: 10 }}
        className="relative"
      >
        <button
          onClick={onClick}
          className="w-full h-full p-4 bg-black/30 backdrop-blur-sm border border-primary/20 rounded-lg text-left flex flex-col items-center justify-center gap-3 text-center hover:bg-primary/20 hover:border-primary transition-all duration-200"
        >
          <div className="text-primary text-glow-primary">
            {getIconForModule(iconKey)}
          </div>
          <p className="font-bold text-sm text-primary">{label}</p>
          <p className="text-xs text-muted-foreground">{module.descricao}</p>
        </button>
      </motion.div>
    );
  };
  
  return (
    <div className="h-full flex flex-col">
       <motion.div 
         initial={{ opacity: 0, y: -20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5 }}
         className="flex items-center justify-center mb-6 relative"
       >
         {selectedGroup && (
           <Button variant="ghost" size="icon" onClick={onBack} className="absolute left-0">
             <ArrowLeft className="h-5 w-5 text-primary" />
           </Button>
         )}
         <h2 className="text-2xl font-bold text-primary text-glow-primary text-center">
           {selectedGroup ? `Módulos de ${selectedGroup.label}` : 'Seleção de Módulos'}
         </h2>
       </motion.div>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 overflow-y-auto pr-2 flex-1"
      >
        {!selectedGroup 
          ? moduleGroups.map((group) => renderModuleCard(group, () => onGroupSelect(group), true))
          : selectedGroup.subModules.map((module) => renderModuleCard(module, () => onModuleSelect(module), false))
        }
      </motion.div>
    </div>
  );
}
