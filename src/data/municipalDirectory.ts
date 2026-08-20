export interface DirectoryEntry {
  id: string;
  area: string;
  usuario: string;
  cargo?: string;
  email?: string;
  telefono?: string;
  extension?: string;
  ubicacion?: string;
}

export const MUNICIPAL_DIRECTORY_RAW: Array<{ area: string; usuario: string }> = [
  // Page 1
  { area: 'AGUA POTABLE Y ALCANTARILLADO', usuario: 'Daniel Fernando Verdugo Rojas' },
  { area: 'ALCALDIA', usuario: 'Angie Anabel Rodondi Benavides' },
  { area: 'ALCALDIA', usuario: 'Juan Carlos Unkuch Kuja' },
  { area: 'ALCALDIA', usuario: 'Mario Andrés Bermeo Guzmán' },
  { area: 'ALCALDIA', usuario: 'Sandra Melina Barahona Rojas' },
  { area: 'BODEGA', usuario: 'Nixon Roberto Sanchez Tapia' },
  { area: 'BODEGA', usuario: 'Rosa Stefanía Cabrera Cabrera' },
  { area: 'COMPRAS PUBLICAS', usuario: 'Cristian Mauricio Yankur Juank' },
  { area: 'CONCEJO MUNICIPAL', usuario: 'Favián Cristian Nayap Yuma' },
  { area: 'CONCEJO MUNICIPAL', usuario: 'Juan Carlos Unkuch Kuja' },
  { area: 'CONCEJO MUNICIPAL', usuario: 'Juwa Pablo Saant Najamtai' },
  { area: 'CONSEJO CANTONAL DE PROTECCIÓN DE DERECHOS', usuario: 'Christian Damian Rojas Suarez' },
  { area: 'CONSEJO CANTONAL DE PROTECCIÓN DE DERECHOS', usuario: 'Fulvia Janet Crespo Orellana' },
  { area: 'CONTABILIDAD', usuario: 'Edel Beatríz Barrera León' },
  { area: 'CONTABILIDAD', usuario: 'Keti Daniela Yakum Chuint' },
  { area: 'CONTABILIDAD', usuario: 'Mirtha Margot Ortíz Garay' },
  { area: 'CONTABILIDAD', usuario: 'Rita Graciela Sarmiento Gutiérrez' },
  { area: 'DEPORTE Y RECREACIÓN', usuario: 'Henry Adrián Cañaveral Paucay' },
  { area: 'DIRECCION ADMINISTRATIVA', usuario: 'Claudio Ermel Rodríguez López' },
  { area: 'DIRECCION ADMINISTRATIVA', usuario: 'Edison Orlando Sicha Puente' },
  { area: 'DIRECCION ADMINISTRATIVA', usuario: 'Galo Nixon Nurinkias Tzamarendia' },
  { area: 'DIRECCIÓN DE OBRAS PUBLICAS', usuario: 'Dalia Carmen Nayapi Chamik' },
  { area: 'DIRECCIÓN DE OBRAS PUBLICAS', usuario: 'Jorge Washington Enríquez Calle' },
  { area: 'DIRECCIÓN DE OBRAS PUBLICAS', usuario: 'Lina Fabiola Sharup Wajarai' },
  { area: 'DIRECCIÓN DE PLANIFICACIÓN', usuario: 'Carlos José Verdugo González' },
  { area: 'DIRECCIÓN DE PLANIFICACIÓN', usuario: 'Irene Leuvina Orellana Vallejo' },
  { area: 'DIRECCIÓN DE PLANIFICACIÓN', usuario: 'Julio Alejandro Martínez Bermeo' },
  { area: 'DIRECCIÓN DE PLANIFICACIÓN', usuario: 'kevin Jahnder Armijos Alvear' },
  { area: 'DIRECCIÓN DE PLANIFICACIÓN', usuario: 'Ramiro Rómulo Jintiach Sharup' },
  { area: 'DIRECCIÓN DE PLANIFICACIÓN', usuario: 'Wilson Iván Nivelo Cabrera' },
  { area: 'DIRECCIÓN FINANCIERA', usuario: 'Feliciano Freddy Chamico Chuindia' },
  { area: 'DIRECCIÓN FINANCIERA', usuario: 'Gina Eliana Tapia Valverde' },
  { area: 'DIRECCIÓN FINANCIERA', usuario: 'Marleni Elizabeth Ortíz Parra' },
  { area: 'DIRECCIÓN FINANCIERA', usuario: 'Martha Raquel Astudillo Cedillo' },
  { area: 'FISCALIZACION', usuario: 'Leonardo Zambrano Vera' },
  { area: 'GESTIÓN AMBIENTAL', usuario: 'Henry Paul Soldado Chacha' },
  { area: 'Gobierno Autónomo Descentralizado Municipal de Logroño', usuario: 'Carlos Alfonso Rivera Riera' },
  { area: 'Gobierno Autónomo Descentralizado Municipal de Logroño', usuario: 'David Eduardo Maldonado Ortiz' },
  { area: 'Gobierno Autónomo Descentralizado Municipal de Logroño', usuario: 'Edgar Freddy Velez Castillo' },
  { area: 'Gobierno Autónomo Descentralizado Municipal de Logroño', usuario: 'Eduardo Bolivar Castillo Calle' },
  { area: 'Gobierno Autónomo Descentralizado Municipal de Logroño', usuario: 'Freddy Gerardo Brito Paspuel' },
  { area: 'Gobierno Autónomo Descentralizado Municipal de Logroño', usuario: 'Jesus Alejandro Peralta Tapia' },

  // Page 2
  { area: 'Gobierno Autónomo Descentralizado Municipal de Logroño', usuario: 'Mario Jamil Rivera Riera' },
  { area: 'Gobierno Autónomo Descentralizado Municipal de Logroño', usuario: 'Olger Ernesto Nurinkias Wajarai' },
  { area: 'Gobierno Autónomo Descentralizado Municipal de Logroño', usuario: 'Teodoro Benito Wiacha Canirsa' },
  { area: 'JEFATURA DE DESARROLLO SOCIAL Y ECONOMÍA', usuario: 'Carlos Steeven Pérez Malla' },
  { area: 'JEFATURA DE DESARROLLO SOCIAL Y ECONOMÍA', usuario: 'Franklin Roberto Saltos Diaz' },
  { area: 'JUNTA CANTONAL DE PROTECCIÓN DE DERECHOS', usuario: 'Bryan Paúl Revelo Taza' },
  { area: 'JUNTA CANTONAL DE PROTECCIÓN DE DERECHOS', usuario: 'Jenny Karina Shicay Llivicura' },
  { area: 'JUNTA CANTONAL DE PROTECCIÓN DE DERECHOS', usuario: 'Jerson Paúl Díaz Gonzáles' },
  { area: 'JUNTA CANTONAL DE PROTECCIÓN DE DERECHOS', usuario: 'Mirian Jhoimy Jaramillo Rojas' },
  { area: 'OBRAS CIVILES Y VIALIDAD', usuario: 'José Luis Rojas Peralta' },
  { area: 'OBRAS CIVILES Y VIALIDAD', usuario: 'Katia Margarita Carrión Atiaja' },
  { area: 'PARQUES, JARDINES Y EQUIP. PUBLICO', usuario: 'Fredy Alexis Ortiz Lozado' },
  { area: 'PROCURADURÍA SINDICA', usuario: 'Ángel Stalin Aguilar Mejía' },
  { area: 'PROCURADURÍA SINDICA', usuario: 'Mesias Raúl Chuint Nurinkias' },
  { area: 'PROYECTOS MIES', usuario: 'Freiman Manolo Sacoto Zúñiga' },
  { area: 'RENTAS', usuario: 'Eliana Esther Antich Antunish' },
  { area: 'SECRETARÍA GENERAL', usuario: 'Olmar Darwin Utitiaj Wachapa' },
  { area: 'TALLERES Y MANTENIMIENTO GENERAL', usuario: 'Cristian Paúl León Molina' },
  { area: 'TECNG. INFORMACIÓN Y COMUNICACIONES', usuario: 'Nashir Olguer Ankuash Atamaint' },
  { area: 'TESORERÍA Y COACT.', usuario: 'Gina Eliana Tapia Valverde' },
  { area: 'TESORERÍA Y COACT.', usuario: 'Liliana Emerita Vásquez Bermeo' },
  { area: 'TRANSITO Y MOVILIDAD', usuario: 'Cristofer Andres Rivera Sicha' },
  { area: 'TURISMO', usuario: 'Luis Gabriel Tapia Molina' },
  { area: 'UNIDAD ADMINISTRATIVA TALENTO HUMANO', usuario: 'Alex Paul Alvarado Cozar' },
  { area: 'UNIDAD ADMINISTRATIVA TALENTO HUMANO', usuario: 'Byron Jonas Naranjo Cando' },
  { area: 'UNIDAD ADMINISTRATIVA TALENTO HUMANO', usuario: 'Jessica Maricela Lopez Barrera' },
  { area: 'UNIDAD ADMINISTRATIVA TALENTO HUMANO', usuario: 'Paolo Fernando Lituma Torres' },
  { area: 'AVALUOS Y CATASTROS', usuario: 'Jaime Tito Naranza Nanchi' },
  { area: 'AVALUOS Y CATASTROS', usuario: 'Jose Leonidas Ruilova Méndez' },
  { area: 'COMUNICACIONES', usuario: 'Henry Daniel Carreño Rivera' },
  { area: 'COMUNICACIONES', usuario: 'Juan Diego Brito Calle' },
  { area: 'CONCEJO MUNICIPAL', usuario: 'Mery Margoth Wajarai Kayap' },
  { area: 'CONCEJO MUNICIPAL', usuario: 'René Remigio Altamirano Altamirano' },

  // Page 3
  { area: 'CONCEJO MUNICIPAL', usuario: 'Tito Juan Ponchera Anguash' },
  { area: 'DEPORTE Y RECREACIÓN', usuario: 'Guido Patricio Mora Chila' },
  { area: 'DIRECCIÓN DE OBRAS PUBLICAS', usuario: 'Samuel Ernesto Arévalo Ochoa' },
  { area: 'Gobierno Autónomo Descentralizado Municipal de Logroño', usuario: 'Angel Federico Mukucham Cayapa' },
  { area: 'Gobierno Autónomo Descentralizado Municipal de Logroño', usuario: 'Ceferino Shakai Nunink' },
  { area: 'JEFATURA DE DESARROLLO SOCIAL Y ECONOMÍA', usuario: 'Angel Ambrocio Sharup Chumpi' },
  { area: 'JEFATURA DE DESARROLLO SOCIAL Y ECONOMÍA', usuario: 'Damaris Gabriela Fernandez Tenecela' },
  { area: 'JEFATURA DE DESARROLLO SOCIAL Y ECONOMÍA', usuario: 'Franklin Raúl Torres Delgado' },
  { area: 'JEFATURA DE DESARROLLO SOCIAL Y ECONOMÍA', usuario: 'Itati Lizeth Wampash Kuja' },
  { area: 'JEFATURA DE DESARROLLO SOCIAL Y ECONOMÍA', usuario: 'Jose Antonio Cedeño Mera' },
  { area: 'JEFATURA DE DESARROLLO SOCIAL Y ECONOMÍA', usuario: 'Mishel Paola Vega Kasent' },
  { area: 'JEFATURA DE DESARROLLO SOCIAL Y ECONOMÍA', usuario: 'Sintia Germania Andrade Caceres' },
  { area: 'JEFATURA DE DESARROLLO SOCIAL Y ECONOMÍA', usuario: 'Victor Manuel Jimbo Coyago' },

  // Page 4
  { area: 'PROYECTOS MIES', usuario: 'Julitza Vaneza Rivera Cajilima' },
  { area: 'PROYECTOS MIES', usuario: 'Widinson Fabricio Vallejo Cabrera' },
  { area: 'PROYECTOS MIES', usuario: 'Wilda Janela Pitiur Jiukam' },
  { area: 'TALLERES Y MANTENIMIENTO GENERAL', usuario: 'James Patricio Jaramillo Urgilez' },
  { area: 'TURISMO', usuario: 'Jhinson Javier Cordova Zuñiga' }
];

// Helper to normalize and remove exact duplicates
const seen = new Set<string>();
export const MUNICIPAL_DIRECTORY: DirectoryEntry[] = [];

MUNICIPAL_DIRECTORY_RAW.forEach((item, index) => {
  const key = `${item.area.trim()}__${item.usuario.trim()}`.toLowerCase();
  if (!seen.has(key)) {
    seen.add(key);

    // Create institutional email slug
    const nameParts = item.usuario.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(' ').filter(Boolean);
    const emailPrefix = nameParts.length >= 2 
      ? `${nameParts[0][0]}.${nameParts[nameParts.length - 1]}` 
      : nameParts[0] || 'contacto';
    
    // Default telephone / extensions
    const phone = '(07) 2700-100';

    MUNICIPAL_DIRECTORY.push({
      id: `dir-${index + 1}`,
      area: item.area.trim(),
      usuario: item.usuario.trim(),
      cargo: 'Funcionario / Técnico Municipal',
      email: `${emailPrefix}@gadlogrono.gob.ec`,
      telefono: phone,
      ubicacion: 'Palacio Municipal de Logroño, Calle 10 de Agosto'
    });
  }
});

// Group by Area
export const DIRECTORY_AREAS = Array.from(new Set(MUNICIPAL_DIRECTORY.map((d) => d.area))).sort();
