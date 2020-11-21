import Twilio from "twilio"
import {Client as ConversationsClient} from "@twilio/conversations";

export class TwilioClient {
    constructor() {
        this.singleton = null;

        this.twilioSingleton = this.twilioSingleton.bind(this);

    }

    twilioSingleton = async () => {
        if (!this.singleton) {
            window.conversationsClient = ConversationsClient;
            this.singleton = await ConversationsClient.create(this.generateToken());
            return this.singleton;
        }
        else {
            return this.singleton;
        }
    }

    generateToken = () => {
        // To set up environmental variables, see http://twil.io/secure
        const twilioAccountSid = process.env.REACT_APP_TWILLIO_ACCOUNT_SID;
        const twilioApiKey = process.env.REACT_APP_TWILIO_API_KEY;
        const twilioApiSecret = process.env.REACT_APP_TWILIO_API_SECRET;

        // Used specifically for creating Chat tokens
        const serviceSid = process.env.REACT_APP_TWILIO_CHAT_SERVICE_SID;
        const identity = process.env.REACT_APP_TWILIO_DEFAULT_IDENTITY;

        // Create a "grant" which enables a client to use Chat as a given user,
        // on a given device
        const chatGrant = new Twilio.jwt.AccessToken.ChatGrant({
            serviceSid: serviceSid,
        });

        // Create an access token which we will sign and return to the client,
        // containing the grant we just created
        const token = new Twilio.jwt.AccessToken(
            twilioAccountSid,
            twilioApiKey,
            twilioApiSecret,
            {identity: identity}
        );

        token.addGrant(chatGrant);
        console.log(token.toJwt());

        return(token.toJwt());
    };
}