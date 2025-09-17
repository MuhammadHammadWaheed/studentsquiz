const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(express.json());


const DATA_FILE = path.join(__dirname, 'messages.json');
function readData(){
try { return JSON.parse(fs.readFileSync(DATA_FILE,'utf8')||'[]'); } catch(e){ return []; }
}
function writeData(d){ fs.writeFileSync(DATA_FILE, JSON.stringify(d,null,2)); }


app.get('/api/messages', (req,res)=>{
res.json(readData());
});


app.post('/api/messages', (req,res)=>{
const list = readData();
const m = req.body;
if(!m || !m.name || !m.msg) return res.status(400).json({error:'invalid'});
list.push({name:m.name, msg:m.msg, t:m.t||Date.now()});
writeData(list);
res.json({ok:true});
});


const PORT = 3000;
app.listen(PORT, ()=> console.log('Server running on port', PORT));
