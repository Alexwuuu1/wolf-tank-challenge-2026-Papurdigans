const express = require('express');
const router = express.Router();
// Importamos el modelo que creaste en el paso anterior
const { CampanaEspecial } = require('../models'); 

// Endpoint para obtener todas las campañas florales
router.get('/campanas', async (req, res) => {
  try {
    const campanas = await CampanaEspecial.findAll();
    
    // Si la base de datos está vacía, mandamos las por defecto para que no se vea vacío el frontend
    if (campanas.length === 0) {
      return res.json([
        { id: 1, fecha: '27 de Mayo', titulo: 'Día de la Madre', desc: 'Asegura los mejores ramos de rosas y canastas personalizadas para mamá antes de que se agoten.', icono: '🌹', estado: 'Alta Demanda' },
        { id: 2, fecha: '21 de Septiembre', titulo: 'Flores Amarillas', desc: 'La tendencia más grande del año. Detalles vivos, girasoles y arreglos con tonos luminosos.', icono: '🌻', estado: 'Próximamente' },
        { id: 3, fecha: '14 de Febrero', titulo: 'San Valentín', desc: 'El día del amor. Rosas importadas, cajas premium, dedicatorias especiales y entregas programadas.', icono: '💝', estado: 'Campaña Cerrada' },
        { id: 4, fecha: '25 de Diciembre', titulo: 'Navidad y Fin de Año', desc: 'Arreglos navideños para el hogar, centros de mesa y regalos de temporada.', icono: '🎄', estado: 'Próximamente' }
      ]);
    }

    return res.json(campanas);
  } catch (error) {
    console.error('Error al obtener campañas:', error);
    return res.status(500).json({ message: 'Error en el servidor al cargar las campañas' });
  }
});

// Endpoint por si el usuario quiere guardar o pre-reservar una campaña desde el modal
router.post('/campanas/reserva', async (req, res) => {
  try {
    const { campanaId, detalle } = req.body;
    // Aquí puedes meter luego la lógica para guardar la pre-reserva en la BD
    return res.status(201).json({ success: true, message: 'Pre-reserva registrada con éxito en el backend' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al procesar la reserva' });
  }
});

module.exports = router;
