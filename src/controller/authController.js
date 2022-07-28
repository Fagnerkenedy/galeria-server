require('dotenv').config()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const nodemailer = require('nodemailer')

const authConfig = require('../config/auth.json')

const User = require('../models/user')


module.exports =  {
    // New User
    register: async (req, res) => {
        console.log(req.body)
        const { email, sitename } = req.body
        try {
    
            if(await User.findOne({ email }))
                return res.status(200).json({ success: false, message: 'User Already Exists!' })
            
            req.body.uuid = crypto.randomUUID()

            const user = await User.create(req.body)

            user.password = undefined
    
            return res.status(200).json({ success: true, message: 'User Created Successfuly!' })
        }catch (err) {
            console.log('Error Creating User', err)
            return res.status(400).json({ success: false, message: 'Error Creating User', error: err })
        }
    },

    checkSiteName: async (req, res) => {
        const { sitename } = req.body
        try {
            if( await User.findOne({ sitename }))
                return res.status(200).json({ success: true, message: 'Sitename Already Exists!' })
            
            return res.status(400).json({ success: false, message: 'Sitename Not Found!' })
        } catch (error) {
            return res.status(400).json({ success: false, message: 'Error Searching Sitename', error: err })
        }
    },

    checkEmail: async (req, res) => {
        const { email } = req.body
        try {
            if(await User.findOne({ email }))
                return res.status(200).json({ success: true, message: 'Email Already Exists!' })
            
            return res.status(200).json({ success: false, message: 'E-mail Not Found!' })
        } catch (error) {
            return res.status(400).json({ success: false, message: 'Error Searching E-mail', error: err })
        }
    },

    login: async (req, res) => {
        const { email, password } = req.body
        
        const user = await User.findOne({ email }).select('+password')
    
        if(!user)
            return res.status(400).json({ success: false, message: 'User not found!' })
    
        if(!await bcrypt.compare(password, user.password))
            return res.status(400).json({ success: false, message: 'Invalid password!' })
        
        if(user.verificado !== true)
            return res.status(400).json({ success: false, message: 'User Not Verified!', user })

        user.password = undefined
    
        const token = jwt.sign({ id: user.id }, authConfig.secret, {
            expiresIn: 604800,
        })
    
        res.send({ user, token })
    },

    sendMailConfirmation: async (req, res) => {
        const transporter = nodemailer.createTransport({
            host: process.env.NODEMAILER_SMTP,
            port: process.env.NODEMAILER_PORT,
            secure: false,
            auth: {
                user: process.env.NODEMAILER_USER, 
                pass: process.env.NODEMAILER_PASS
            },
            tls: {
                ciphers:'SSLv3'
            }
        })

        transporter.sendMail({
            from: process.env.NODEMAILER_USER,
            to: req.body.email,
            replyTo: process.env.NODEMAILER_USER,
            subject: "Guêleria - Confirmação de cadastro",
            text: "Obrigado por se cadastrar no nosso sistema, por favor confirme seu email clicando no link: http://localhost:3001/auth/confirmation/" + req.body.uuid,
        }).then(info => {
            res.status(200).json({ success: true, message: info })
        }).catch(error => {
            res.status(400).json({ success: false, message: error })
        })

    },

    confirmation: async (req, res) => {
        const uuid = req.body.uuid;

        try {

            const user = await User.findOne({ uuid });
            
            if(!user)
                return res.status(400).json({ success: false, message: 'User not found!' })

            if(user.verificado)
                return res.status(400).json({ success: false, message: 'User already confirmed!' })

            user.verificado = true
            await user.save()
            res.status(200).json({ success:true, message: 'User Confirmed!' })
            
        } catch (error) {
            res.status(400).json({ error })
        }

    },

}