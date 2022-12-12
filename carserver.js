let express = require("express");

var cors = require("cors");
let app = express();
app.use(cors());

app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested=With,X-Auth-Token, Content-Type, Accept"
  );
  next();
});
var port = process.env.PORT || 2410;
app.listen(port, () => console.log(`Node app listening on port ${port}!`));

let { car1 } = require("./cardata1");
let { car2 } = require("./cardata2");


app.delete("/cars/:id", function (req, res) {
  let id = req.params.id;
  let index = car1.findIndex((st) => st.id === id);
  console.log(id)
  console.log(index)
  let deletedcar = index>=0 ? car1.splice(index,1) : "Data not found";
  res.send(deletedcar);
});

app.post("/cars", function (req, res) {
  let body = req.body;
  let newcar = { ...body };
  car1.push(newcar);
  res.send(car1);
});

app.put("/cars/:id", function (req, res) {
  let id = req.params.id;
  let body = req.body;
  let index = car1.findIndex((st) => st.id === id);
  if (index >= 0) {
    let updatedcar = { id: id, ...body };
    car1[index] = updatedcar;

    res.send(updatedcar);
  } else res.status(404).send("No student found");
});


app.get("/cars", function (req, res) {
  let fuel = req.query.fuel;
  let type = req.query.type;
  let minprice = req.query.minprice;
  let maxprice = req.query.maxprice;
  let sort = req.query.sort;
  let arr1 = car1;

  if (fuel) {
    let arr = car2.filter((f) => f.fuel === fuel);
    arr1 = arr1.filter((st) => arr.find((f) => st.model === f.model));
  }
  if (type) {
    let arr = car2.filter((f) => f.type === type);
    arr1 = arr1.filter((st) => arr.find((f) => st.model === f.model));
  }
  if (minprice) {
    arr1 = arr1.filter((st) => st.price > minprice);
  }

  if (maxprice) {
    arr1 = arr1.filter((st) => st.price < maxprice);
  }

  if (sort === "kms") arr1.sort((st1, st2) => st1.kms - st2.kms);
  if (sort === "price") arr1.sort((st1, st2) => st1.price - st2.price);
  if (sort === "year") arr1.sort((st1, st2) => st1.year - st2.year);

  res.send(arr1);

  app.get("/cars/:id", function (req, res) {
    let id = req.params.id;
    let index = car1.find((st) => st.id === id);
    res.send(index);
  });

});