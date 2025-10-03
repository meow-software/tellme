import { Injectable, NestMiddleware } from '@nestjs/common';
import { IAuthenticatedRequest, getSupportedLanguage, requireEnv , langFromAcceptLanguage} from './../';
import { Response, NextFunction } from 'express';

/**
 * Language Middleware
 * 
 * Determines the user's preferred language through multiple fallback methods:
 * 1. Cookie preference (highest priority if exists)
 * 2. User's language setting in database (for authenticated users)
 * 3. Accept-Language header from browser
 * 4. Default to English if no language detected
 * 
 * Sets the language in request context and updates cookie if needed
 */
@Injectable()
export class LanguageMiddleware implements NestMiddleware {
    /**
     * Middleware implementation to detect and set user language
     * @param req - Authenticated request with user information
     * @param res - Response object to set language cookie
     * @param next - Next function in middleware chain
     */
    use(req: IAuthenticatedRequest, res: Response, next: NextFunction): void {
        // First priority: Check if language is stored in cookie
        let lang = req.cookies['lang'];

        // Second priority: Check authenticated user's language preference
        if (!lang && req.user && req.user.lang) {
            console.log("Language provided by JWT Guard - user:", req.user);
            lang = req.user.lang || 'en';
        }

        // Third priority: Extract from browser's Accept-Language header
        if (!lang) {
            const acceptLang = req.headers['accept-language'];
            lang = langFromAcceptLanguage(acceptLang);
            console.log("Language provided by Accept-Language header:", lang);
        }

        // Validate and set the final language
        console.log("Final determined language:", lang);

        // Update cookie if language has changed or doesn't exist
        if (req.cookies['lang'] !== lang) {
            // Ensure language is supported, fallback to default if not
            lang = getSupportedLanguage(lang);

            // Store language in request for application use
            req['userLang'] = lang;

            // Update language cookie with expiration
            res.cookie('lang', lang, {
                maxAge: Number(requireEnv('COOKIE_MAX_TTL')) * 1000,
                httpOnly: false
            });
        }

        next();
    }
}