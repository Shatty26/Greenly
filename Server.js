import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());

app.use(express.json());

app.post("/crear-checkout-session", async (req, res) => {

    try {

        const { plan } = req.body;

        let amount = 0;

        if (plan === "Green Monthly") {
            amount = 499;
        }

        else if (plan === "Eco Annual") {
            amount = 4900;
        }

        const session = await stripe.checkout.sessions.create({

            payment_method_types: ["card"],

            line_items: [
                {
                    price_data: {

                        currency: "usd",

                        product_data: {
                            name: plan,
                        },

                        unit_amount: amount,
                    },

                    quantity: 1,
                },
            ],

            mode: "payment",

            success_url: "http://localhost:5173/success",

            cancel_url: "http://localhost:5173/cancel",
        });

        res.json({ url: session.url });
        
        console.log(session.url);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: "Error creating checkout session",
        });
    }
});

app.listen(3000, () => {
    console.log("Servidor backend iniciado en puerto 3000");
});