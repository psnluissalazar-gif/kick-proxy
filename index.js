const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/channel/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const response = await fetch(`https://kick.com/api/v1/channels/${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json'
      }
    });

    const raw = await response.text();

    try {
      const data = JSON.parse(raw);
      res.json(data);
    } catch (jsonError) {
      res.status(500).json({
        error: 'Kick respondió con HTML o JSON inválido',
        hint: 'Puede que Kick haya cambiado el formato',
        raw: raw.slice(0, 300)
      });
    }

  } catch (error) {
    res.status(500).json({
      error: 'Error al obtener el canal de Kick',
      details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor proxy corriendo en el puerto ${PORT}`);
});
