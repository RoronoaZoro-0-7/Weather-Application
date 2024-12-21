import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "Weather",
    password: "N.Jaswanth07",
    port: 5432,
});

db.connect()
  .then(() => {
    console.log("Connected to PostgreSQL database");
  })
  .catch(err => console.error("Error connecting to PostgreSQL database", err));

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index.ejs", { city: "" });
});

app.get("/history", (req, res) => {
    db.query("SELECT * FROM cities", (error, result) => {
        if (error) {
            console.error("Error fetching cities from the database:", error);
            res.status(500).send("Error fetching cities");
        } else {
            res.render("history", { cities: result.rows });
        }
    });
});

app.get("/index", (req, res) => {
    res.render("index.ejs", { city: "" });
});

app.post("/index", (req, res) => {
    let city = req.body["city"];
    if (city === "") city = "Delhi";
    city = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();

    db.query("SELECT * FROM cities WHERE city = $1", [city], (error, result) => {
        if (error) {
            console.log(error);
        } else {
            if (result.rows.length === 0) {
                db.query("INSERT INTO cities (city) VALUES ($1)", [city], (err) => {
                    if (err) {
                        console.log("Error inserting city:", err);
                    } else {
                        console.log("City inserted successfully.");
                    }
                });
            } else {
                console.log("City already exists in the database.");
            }
        }
    });

    res.render("index", { city });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});