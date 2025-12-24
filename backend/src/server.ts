require('module-alias').addAliases({ '@': __dirname });
import env from '@/env';
import errorHandler from 'errorhandler';
import app from './app';
import { textSync } from 'figlet';
/**
 * Error Handler. Provides full stack - remove for production
 */
if (env.isDev) {
    // only use in development
    app.use(errorHandler());
}
console.log(`
${textSync('Node\nService', 'Star Wars')}
Version: ${process.env.npm_package_version}
`);
const server = app.listen(app.get('port'), () => {
    console.log('App is running at http://localhost:%d in %s mode\n', app.get('port'), app.get('env'));
});
export default server;