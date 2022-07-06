const express=require("express");
const cors=require("cors");
const ticketRouting=require("./route");

const application=express();
application.use(cors());
application.use(express.json());

application.use(ticketRouting);

application.listen(5000, () => {
    console.log("Server is listening at port 5000");
});