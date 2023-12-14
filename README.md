# Mon vieux grimoire (un site de notation de livres)

<p>J'ai créé un site de notation de livres en utilisant Node.js et Mongo DB, dans le cadre de projet de ma formation en tant qu'intégrateur web chez OpenClassrooms.</p>
<p>  👇 </p>

* **Pour exécuter ce projet**
<p>Cloner le repo en local</p>

```bash
cd frontend

npm install

npm run start
```

```bash
cd backend

npm install

npm start
```
  
## Preview

<img src="https://i.ibb.co/KNjrwMZ/Capture-d-cran-2023-12-14-152515.png" />

## le délai de production du site
21.10.23 - 03.11.23

## Stack utilisé
Node.js, Express, Mongo DB

## Point
<p> Grâce à ce projet, j'ai pu mieux comprendre comment le côté client interagit avec le serveur. </p>
<p> En utilisant Helmet et dotenv, j'ai acquis une meilleure compréhension de la cybersécurité. </p>

## Problème en réalisant ce projet

<p>Pendant ce projet, une erreur liée à CORS est survenue en raison de la différence entre le domaine du côté client et celui du côté serveur. </p>
<p>Pour résoudre ce problème, j'ai ajouté un package npm appelé cors en utilisant le code suivant :</p>

```bash

const cors = require('cors');
app.use(cors());

```
