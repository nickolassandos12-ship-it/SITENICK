const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, ".")));

// Configuração de conexão flexível (Railway ou Local)
const db = mysql.createConnection({
  host: process.env.MYSQLHOST || "localhost",
  user: process.env.MYSQLUSER || "root",
  password: process.env.MYSQLPASSWORD || "",
  database: process.env.MYSQLDATABASE || "doe",
  port: process.env.MYSQLPORT || 3306
});

db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar no banco:", err);
    return;
  }
  console.log("Banco de Dados conectado com sucesso!");
  
  // Criação automática das tabelas no Railway
  db.query(`CREATE TABLE IF NOT EXISTS registros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo ENUM('doacao', 'pedido') NOT NULL,
    endereco VARCHAR(255),
    descricao TEXT,
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);

  db.query(`CREATE TABLE IF NOT EXISTS voluntarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255),
    telefone VARCHAR(20),
    email VARCHAR(255),
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
});

// Rotas de API
app.post("/api/ajudar", (req, res) => {
  const { tipo, endereco, descricao } = req.body;
  db.query("INSERT INTO registros (tipo, endereco, descricao) VALUES (?, ?, ?)", 
  [tipo, endereco, descricao], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Recebemos sua solicitação!" });
  });
});

app.post("/api/voluntarios", (req, res) => {
  const { nome, telefone, email } = req.body;
  db.query("INSERT INTO voluntarios (nome, telefone, email) VALUES (?, ?, ?)", 
  [nome, telefone, email], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Cadastro de voluntário realizado!" });
  });
});

// Porta dinâmica para o Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

// Rota para buscar todas as doações e pedidos
app.get("/api/logs-registros", (req, res) => {
  db.query("SELECT * FROM registros ORDER BY data_registro DESC", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Rota para buscar todos os voluntários
app.get("/api/logs-voluntarios", (req, res) => {
  db.query("SELECT * FROM voluntarios ORDER BY data_registro DESC", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});v