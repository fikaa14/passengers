const express=require("express");
const router=express.Router();
const Sequalize=require("sequelize");


const dbConnection=new Sequalize("plane_ticket", "root", "", {
    host: "localhost",
    dialect: "mysql"
});

router.route('/')
    .post(
        async (req, res) => {

            let destination="";
            if (req.body.destination==="UK") {
                destination="A";
            } else if (req.body.destination==="Europe") {
                destination="B";
            } else if (req.body.destination==="Asian") {
                destination="C";
            } else if (req.body.destination==="Americas") {
                destination="D";
            }

            let hour=req.body.date.substring(req.body.date.length-5, req.body.date.length-3);
            if (parseInt(hour)||parseInt(hour)<6) {

                destination=destination.toLowerCase();
            }

            let gender=req.body.gender==="male"? "X":"Y"
            let meal=req.body.meal;
            if (meal==="European") { meal="G" }
            else if (meal==="Asian") { meal="H" }
            else if (meal==="Vegetarian") { meal="K" }
            let age=req.body.age;
            if (age<12) {
                gender=gender.toLocaleLowerCase();
                meal=meal.toLocaleLowerCase();
            }

            let flightClass=req.body.flightClass;

            if (flightClass==="First Class") { flightClass="P"; }
            else if (flightClass==="Business") { flightClass="Q"; }
            else if (flightClass==="Economy") { flightClass="R"; }

            let origin=req.body.origin;
            if (origin==="Europe") { origin="-EU"; }
            else { origin="-ZZ"; }

            let passengerCode=`${destination}${gender}${meal}${flightClass}${origin}`;

            let sqlName=req.body.name!=null? req.body.name:"";
            let sqlGender=req.body.gender;
            let sqlAge=req.body.age!=null? req.body.age:0;
            let sqlOrigin=req.body.origin;
            let sqlEmail=req.body.email!=null? req.body.email:"";

            const [results, metaData]=await dbConnection.query(
                "INSERT INTO passenger(name, gender, age, origin, email, passenger_code) VALUES (?,?,?,?,?,?)",
                {
                    replacements: [
                        sqlName,
                        sqlGender,
                        sqlAge,
                        sqlOrigin,
                        sqlEmail,
                        passengerCode
                    ]
                }
            );

            res.send({ "passengerCode": passengerCode });
            //---------SLANJE EMAILA-----------
            /*let transporter=nodeMailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: 'xxx@xx.com', // Ovo bi trebali da budu podaci o mejlu sa kog se salje posto su losi kredencijali ostavicu zakomentarisano
                    pass: 'xxxx'
                }
            });
            let mailOptions={
                from: '"Plane Company" <xx@gmail.com>', // sender address
                to: [req.body.email], // list of receivers
                subject: "Plane code", // Subject line
                text: `Dear ${req.body.name}, \n We are sending you your passenger code: ${passengerCode}. \n Enjoy Your day.`, // plain text body
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                res.send('Message %s sent: %s', info.messageId, info.response);
            });*/



        }
    )

module.exports=router;