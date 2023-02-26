import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import path from "path";
// import cors from 'cors';

export const app = express();
// For production (cf. https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/deployment)
app.use(compression());
// Security: https://github.com/helmetjs/helmet
app.use(helmet({
  contentSecurityPolicy: false,
}));
// app.use(cors());

// Serve React app at /
app.use(express.static(path.join(__dirname, ".", "public")));

app.get('/*', (req,res) => { //this is required to support any client side routing written in react.
  res.sendFile(path.join(__dirname, ".", "public", 'index.html'))
})

app.listen({ port: 4000 }, () =>
  console.log(`⚛️  React app ready at http://localhost:4000`)
);
