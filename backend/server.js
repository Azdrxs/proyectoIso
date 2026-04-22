const express = require('express');
const app = express();
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const db = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'seguridad_app',
  password: '1234',
  port: 5432,
});

const cors = require('cors');

app.use(cors());

app.use(express.json());

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 🔎 Buscar usuario en DB
    const result = await db.query(
      'SELECT * FROM companies WHERE email = $1',
      [email]
    );

    // ❌ Si no existe
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Usuario no existe' });
    }

    const user = result.rows[0];

    // 🔐 Comparar contraseña
    const valid = await bcrypt.compare(password, user.password);

    // ❌ Si no coincide
    if (!valid) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // ✅ Login exitoso
    res.json({ role: 'empresa' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en servidor' });
  }
});

app.post('/register', async (req, res) => {
  const { name, nit, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO companies (name, nit, email, password)
       VALUES ($1, $2, $3, $4)`,
      [name, nit, email, hashedPassword]
    );

    res.json({ message: 'Empresa registrada correctamente' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar empresa' });
  }
});

db.connect()
  .then(() => console.log('✅ Conectado a la base de datos'))
  .catch(err => console.error('❌ Error de conexión', err));

app.listen(3000, () => {
  console.log('Servidor en http://localhost:3000');
});

app.get('/controls/full', async (req, res) => {
  const result = await db.query(`
    SELECT 
      c.code,
      c.name,
      c.category,
      COALESCE(cs.selected, false) AS selected,
      cs.compliance,
      cs.observations
    FROM controls c
    LEFT JOIN control_status cs 
      ON c.code = cs.control_code
    ORDER BY c.code
  `);

  res.json(result.rows);
});

app.post('/controls/status', async (req, res) => {
  const controls = req.body;

  console.log("RECIBIDO:", controls); // 👈 DEBUG

  try {
    for (const c of controls) {
      console.log("GUARDANDO:", c); // 👈 DEBUG

      await db.query(
        `INSERT INTO control_status (control_code, selected, compliance, observations)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (control_code)
         DO UPDATE SET
           selected = EXCLUDED.selected,
           compliance = EXCLUDED.compliance,
           observations = EXCLUDED.observations`,
        [
          c.code || c.id, // 👈 IMPORTANTE (fix clave)
          c.selected ?? false,
          c.compliance ?? null,
          c.observations ?? ''
        ]
      );
    }

    res.json({ message: 'Guardado correctamente' });

  } catch (error) {
    console.error("ERROR GUARDANDO:", error); // 👈 AQUÍ VERÁS EL ERROR REAL
    res.status(500).json({ error: error.message });
  }
});

app.get('/threats', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM threats ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener amenazas' });
  }
});

app.post('/threats', async (req, res) => {
  const { name, description, riskLevel } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO threats (name, description, risk_level)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, description, riskLevel]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear amenaza' });
  }
});

app.put('/threats/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, riskLevel } = req.body;

  try {
    await db.query(
      `UPDATE threats
       SET name = $1, description = $2, risk_level = $3
       WHERE id = $4`,
      [name, description, riskLevel, id]
    );

    res.json({ message: 'Actualizado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar' });
  }
});

app.delete('/threats/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM threats WHERE id = $1', [id]);
    res.json({ message: 'Eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar' });
  }
});