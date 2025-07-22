module.exports = {
  // O ambiente de teste que será usado para o teste
  testEnvironment: 'node',

  // Padrões de caminho que o Haste (o resolvedor de módulos do Jest) deve ignorar.
  // Isso impede que o Jest tente ler e analisar arquivos dentro dessas pastas, resolvendo o erro.
  // Nota: notei um possível erro de digitação "frondend". Adicionei ambos para garantir.
  modulePathIgnorePatterns: [
    '<rootDir>/frondend/',
    '<rootDir>/frontend/'
  ],

  // Padrões de caminho que são ignorados pelo Jest
  testPathIgnorePatterns: ['/node_modules/'],

  // Você pode mover as flags do seu script de teste para cá
  testTimeout: 5000,
  detectOpenHandles: true,
};