import { GoogleApis, calendar_v3, google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();
import { OAuth2Client } from 'google-auth-library';
import { ROLE } from '../global/enum';

const googleOptions = JSON.parse(process.env.CONFIG_GOOGLE as any).web as any;
googleOptions.redirect_uris[0] = String(googleOptions.redirect_uris[0]).replace("http://localhost:3000", process.env.ENV === 'DEV' ? process.env.CLIENT_DOMAIN as string : process.env.CLIENT_DOMAIN_HOST as string);

const defaultConfigCalendar = (config?: calendar_v3.Params$Resource$Events$Insert | undefined) => {
    const start = new Date();
    const end = new Date();
    end.setHours(start.getHours() + 2);
    return {
        calendarId: config?.calendarId ?? '9ca905157a5faf745e7d6456f3a51678f9af45b8f26f7cca5f0bc59c3fbdbd9e@group.calendar.google.com',
        sendUpdates: 'all',
        sendNotifications: true,
        requestBody: {
            start: {
                dateTime: config?.requestBody?.start?.dateTime as string ?? start.toISOString()
            },
            end: {
                dateTime: config?.requestBody?.end?.dateTime as string ?? end.toISOString()
            },
            description: config?.requestBody?.description ?? 'Nội dung thư tự động!',
            summary: config?.requestBody?.summary ?? 'Thư tự động!',
            'conferenceData': {
                'createRequest': {
                    'requestId': crypto.randomUUID(),
                },
            },
            attendees: [
                {
                    email: 'nguyencuong21520@gmail.com',
                },
                {
                    email: 'k12.hr.mindx@gmail.com',
                }
            ],
        },
        conferenceDataVersion: 1,
    }
}
class Google {
    private clientId: string;
    private clientSecret: string;
    private redirectUris: string;
    public oauth2Client: OAuth2Client;
    public ggApis: GoogleApis;
    private calendar: calendar_v3.Calendar;

    constructor(clientId: string, clientSecret: string, redirectUris: string) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.redirectUris = redirectUris;
        this.ggApis = google;
        this.oauth2Client = new this.ggApis.auth.OAuth2(this.clientId, this.clientSecret, this.redirectUris);
        this.calendar = this.ggApis.calendar({
            version: "v3",
            auth: this.oauth2Client,
        });
    }
    generateAuthUrl(role: ROLE) {
        const url = this.oauth2Client.generateAuthUrl({
            access_type: "offline",
            scope: ['https://www.googleapis.com/auth/calendar.readonly', (role && role !== ROLE.TEACHER ? 'https://www.googleapis.com/auth/calendar.events' : '')],
            // redirect_uri: process.env.ENV === 'DEV' ? process.env.CLIENT_DOMAIN : process.env.CLIENT_DOMAIN_HOST
        });
        return url;
    }
    setCredentails(code: string) {
        this.oauth2Client.getToken(code, (err, tokens) => {
            if (err) {
                throw err;
            } else {
                this.oauth2Client.setCredentials(tokens as any);
            }
        });
    }
    getCalendars(calendarId?: string) {
        let result;
        this.calendar.calendarList.get({
            calendarId: calendarId ?? 'primary',
        }, (err, response) => {
            if (err) {
                throw err;
            };
            result = response;
        });
        return result;
    }
    async createEvents(config?: calendar_v3.Params$Resource$Events$Insert | undefined) {

        return this.calendar.events.insert({
            ...defaultConfigCalendar(config)
        }).then(rs => {
            return rs.data
        }).catch(err => {
            throw err
        });
    }
    async updateEvent(eventId: string, config?: calendar_v3.Params$Resource$Events$Insert | undefined) {
        return this.calendar.events.update({
            eventId,
            ...defaultConfigCalendar(config),
        }).then(rs => rs.data).catch(err => {
            throw err;
        });
    }
    async eventList(calendarId?: string, q?: string) {
        return this.calendar.events.list({
            calendarId: calendarId ?? '9ca905157a5faf745e7d6456f3a51678f9af45b8f26f7cca5f0bc59c3fbdbd9e@group.calendar.google.com',
            singleEvents: true,
            maxResults: 1000,
            q
        });
    }
    async getEvent(eventId?: string, calendarId?: string) {
        return this.calendar.events.get({
            eventId,
            calendarId: calendarId ?? '9ca905157a5faf745e7d6456f3a51678f9af45b8f26f7cca5f0bc59c3fbdbd9e@group.calendar.google.com',
        });
    }
}

const boostrapGoogle = new Google(googleOptions.client_id, googleOptions.client_secret, googleOptions.redirect_uris);

export default boostrapGoogle;