const bcrypt = require('bcryptjs');

const senha = 'admin123'; // Substitua pela senha que você quer
const saltRounds = 10;

bcrypt.hash(senha, saltRounds, (err, hash) => {
  if (err) {
    console.error('Erro ao gerar hash:', err);
  } else {
    console.log('Hash gerado:', hash);
  }
});
