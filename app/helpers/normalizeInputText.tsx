const normalizeInput = (input:string|null) => {
    if (!input) return ""; 
    let normalized = input.toLowerCase();
  
    // Substituir caràcters especials (potser afegirr més??)
    normalized = normalized
    .replace(/[áàäâãå]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöôõ]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/[ñł]/g, 'n')
    .replace(/[çč]/g, 'c')
    .replace(/[šş]/g, 's')
    .replace(/[žźż]/g, 'z')
    .replace(/œ/g, 'oe')
    .replace(/æ/g, 'ae')
    .replace(/ø/g, 'o')
    .replace(/å/g, 'a')
    .replace(/ß/g, 'ss')
    .replace(/ğ/g, 'g')
    .replace(/ı/g, 'i')
    .replace(/ý/g, 'y')
    .replace(/ř/g, 'r')
    .replace(/đ/g, 'd');
    // Eliminar tots els caràcters que no siguin lletres, números, guions o guions baixos
    normalized = normalized.replace(/[^a-z0-9-_]/g, '');
  
    return normalized;
  };

  export default normalizeInput;