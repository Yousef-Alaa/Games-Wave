// @params {first_name} {verify_code}
const verifyEmailTemplate = `
<div style="font-family: sans-serif;">
    <div style="
        color: #2980B9;
        font-weight: bold;
        margin: 21px 0;
        text-align: center;
        ">
        <div style="overflow: hidden;display: inline-block;">
            <img src="cid:logo" style="height: 36px;float: left;">
            <span style="font-size: 24px;height: 36px;line-height: 36px;float: left;">Games Wave</span>
        </div>
    </div>
    <h1 style="
        background: #2980B9;
        color: #FFF;
        margin-top: 0;
        text-align: center;
        padding: 15px 0;
        ">Verify Email</h1>
    <p style="
    color: #455A64;
    font-family: system-ui;
    padding: 0 5%;
    font-size: 1rem;">Hi {first_name},<br />
        You're almost set to start enjoying our application. Simply copy the code below to verify your email address and get started. The code expires in one hour.
    </p>
    <span style="
        display: block;
        text-align: center;
        font-size: 26px;
        letter-spacing: 4px;
        color: #2980B9;
        font-weight: bold;
        margin: 26px 0;">{verify_code}</span>
    <span style="
        display: block;
        width: 80%;
        height: 1.5px;
        background: #2980B9;
        margin: auto;
        opacity: .3;"></span>
    <div style="
        text-align: center;
        margin: 21px 0px;
        font-size: 14px;
        color: #90A4AE;">if you didn't request this email you can safely ignore it.</div>
</div>

`
// @params {first_name} {reset_link}
const resetPasswordTemplate = `
<div style="font-family: sans-serif;">
    <div style="
        color: #2980B9;
        font-weight: bold;
        margin: 21px 0;
        text-align: center;
        ">
        <div style="overflow: hidden;display: inline-block;">
            <img src="cid:logo" style="height: 36px;float: left;">
            <span style="font-size: 24px;height: 36px;line-height: 36px;float: left;">Games Wave</span>
        </div>
    </div>
    <h1 style="
    background: #2980B9;
    color: #FFF;
    margin-top: 0;
    text-align: center;
    padding: 15px 0;">Reset Password</h1>
    <p style="
    color: #455A64;
    font-family: system-ui;
    padding: 0 5%;
    font-size: 1rem;
    ">Hi {first_name},<br />if you've lost your password or wish to reset it use the link below to get started.<br />The code expires in one hour.</p>
    <div style="margin: 36px 0;text-align: center;">
        <a href="{reset_link}" style="
            background: #2980B9;
            color: #FFF;
            text-decoration: none;
            padding: 10px 15px;
            border-radius: 5px;
            font-size: 1.1rem;">Reset Password</a>
    </div>
    <span style="
    display: block;
    width: 80%;
    height: 1.5px;
    background: #2980B9;
    margin: auto;
    opacity: .3;"></span>
    <div style="
    text-align: center;
    margin: 21px 0px;
    font-size: 14px;
    padding: 0 5%;
    color: #90A4AE;">if you didn't request a password reset, you can safely ignore this email. only a person with access to your email can reset your account password.</div>
</div>
`

module.exports = { verifyEmailTemplate, resetPasswordTemplate }
