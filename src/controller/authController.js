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
    
            return res.status(200).json({ success: true, message: 'User Created Successfuly!', user})
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
                return res.status(200).json({ success: false, message: 'Email Already Exists!' })
            
            return res.status(200).json({ success: true, message: 'E-mail Not Found!' })
        } catch (error) {
            return res.status(400).json({ success: false, message: 'Error Searching E-mail', error: err })
        }
    },

    login: async (req, res) => {
        const { email, password } = req.body
        
        const user = await User.findOne({ email }).select('+password')
    
        if(!user)
            return res.status(200).json({ success: false, message: 'user_not_found' })
    
        if(!await bcrypt.compare(password, user.password))
            return res.status(200).json({ success: false, message: 'invalid_password' })
        
        if(user.verificado !== true)
            return res.status(200).json({ success: false, message: 'user_not_verified', user })

        user.password = undefined
    
        const token = jwt.sign({ id: user.id }, authConfig.secret, {
            expiresIn: 604800,
        })
    
        res.send({ success: true, message: 'Sucesso ao fazer login', user, token })
    },

    sendMailConfirmation: async (req, res) => {
        console.log(req)
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
            subject: "Photos2You - Confirmação de cadastro",
            text: "Obrigado por se cadastrar no nosso sistema, por favor confirme seu email clicando no link: "+process.env.FRONT_URL+"/cadastro/confirmacao/" + req.body.uuid,
        }).then(info => {
            res.status(200).json({ success: true, message: info })
        }).catch(error => {
            res.status(400).json({ success: false, message: error })
        })

    },

    confirmation: async (req, res) => {
        console.log(req.body)
        const { uuid } = req.body;

        try {

            const user = await User.findOne({ uuid });
            if(!user)
                return res.status(200).json({ success: false, message: 'user_not_found' })

            if(user.verificado)
                return res.status(200).json({ success: false, message: 'user_already_confirmed' })

            user.verificado = true
            await user.save()
            res.status(200).json({ success:true, message: 'user_confirmed' })
            
        } catch (error) {
            res.status(400).json({ error })
        }

    },

    update: async (req, res) => {
        console.log(req.params)
        try {
            const user = await User.findByIdAndUpdate( req.params.batata, {$set: req.body});
            return res.status(200).json({ success: true, message: 'user_update_successfuly', data: user})
        }catch (err) {
            console.log('Error Creating User', err)
            return res.status(400).json({ success: false, message: 'Error Creating User', error: err })
        }
    },

    getUser: async (req, res) => {
        const { uuid } = req.params
        try {
            
            const user = await User.findOne({ uuid });

            if(user){
                user.password = undefined
                return res.status(200).json({ success: true, message: 'usuario_encontrado', data: user })
            }

        }catch (err) {
            console.log('Error Creating User', err)
            return res.status(400).json({ success: false, message: 'Error Creating User', error: err })
        }
    },

}