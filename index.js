import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const client = new pg.Client({

  user: "postgres",
  host: "localhost",
  database: "valhalla",
  password: "Jagmag852002",
  port: 5432,

});

client.connect();


app.get("/", async (req, res) => {

  try {

    const result = await client.query("SELECT country_codes FROM travelogue"); 
    
    console.log(result.rows);     
    
    let countries = []; 

    result.rows.forEach(row => {

      countries.push(row.country_codes); 

    });

    res.render("index.ejs", { countriez: countries});
    console.log(countries); 

  } catch (error){ 
    console.error("Error in execution", error);
  }

});


app.post("/add", async (req, res) => {

  const ans = req.body.text; 

  const response1 = await client.query("SELECT country_code FROM country_codes WHERE country_name = $1", [ans]);
  console.log(response1);  

  if (response1.rows.length != 0){
    await client.query("INSERT INTO travelogue (country_codes) VALUES ($1)", [response1]); 
    res.redirect("/"); 

  } else {console.log("Invalid country name")}; 

});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
