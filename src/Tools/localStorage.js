/**
 * Módulo para manejar el almacenamiento local del navegador
 * Proporciona funciones para guardar, obtener y limpiar puntuaciones
 */
const LocalStorage = (() => {
  /**
   * Guarda una puntuación en el almacenamiento local
   * @param {number} score - Puntuación a guardar
   */
  const saveScore = (score) => {
    localStorage.setItem('score', JSON.stringify(score));
  };
  
  /**
   * Obtiene la puntuación guardada del almacenamiento local
   * @returns {number} - Puntuación guardada o 1 si no existe
   */
  const getScore = () => {
    const score = JSON.parse(localStorage.getItem('score'));
    if (!score) {
      return 1;  // Valor por defecto si no hay puntuación guardada
    }
    return score;
  };
  
  /**
   * Limpia todo el almacenamiento local
   */
  const clearStorage = () => {
    localStorage.clear();
  };
  
  return { saveScore, getScore, clearStorage };
})();

export default LocalStorage;