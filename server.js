const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Serve os arquivos da pasta atual (HTML, CSS, JS)
app.use(express.static(__dirname));

// Configuração do MySQL - Adaptada para Railway (Hopper)
const db = mysql.createConnection({
  host: process.env.MYSQLHOST || "hopper.proxy.rlwy.net",
  user: process.env.MYSQLUSER || "root",
  password: process.env.MYSQLPASSWORD || "NywwwbFlzvPiVtoDmTxtmCvXmoZiCsS",
  database: process.env.MYSQLDATABASE || "railway",
  port: process.env.MYSQLPORT || 54673 // Porta externa do Hopper
});

db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar no MySQL do Railway:", err);
    return;
  }
  console.log("✅ Conectado ao banco de dados 'railway' no host Hopper!");

  // Criar tabelas se não existirem
  db.query(`
    CREATE TABLE IF NOT EXISTS registros (
      id INT AUTO_INCREMENT PRIMARY KEY,
      tipo ENUM('doacao', 'pedido') NOT NULL,
      endereco VARCHAR(255),
      descricao TEXT,
      data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.query(`
    CREATE TABLE IF NOT EXISTS voluntarios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(255),
      telefone VARCHAR(20),
      email VARCHAR(255),
      data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// Rotas de envio (Permanecem iguais)
app.post("/api/ajudar", (req, res) => {
  const { tipo, endereco, descricao } = req.body;
  const sql = "INSERT INTO registros (tipo, endereco, descricao) VALUES (?, ?, ?)";
  db.query(sql, [tipo, endereco, descricao], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Solicitação enviada com sucesso!" });
  });
});

app.post("/api/voluntarios", (req, res) => {
  const { nome, telefone, email } = req.body;
  const sql = "INSERT INTO voluntarios (nome, telefone, email) VALUES (?, ?, ?)";
  db.query(sql, [nome, telefone, email], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Cadastro de voluntário realizado!" });
  });
});

// Rotas de leitura para a página admin.html
app.get("/api/logs-registros", (req, res) => {
  db.query("SELECT * FROM registros ORDER BY data_registro DESC", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.get("/api/logs-voluntarios", (req, res) => {
  db.query("SELECT * FROM voluntarios ORDER BY data_registro DESC", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// AJUSTE CRÍTICO DE PORTA:
// O Railway define a porta automaticamente. Se não houver, usa a 3000.
const PORT = process.env.PORT || 3306;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));