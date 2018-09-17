/**
 * Created by sadra on 11/25/17.
 */

const message = (message, status, developerMessage, func) => {

    console.log('Error in <'+func.name+'>, & Because of: '+  developerMessage);

    return {
        status: status,
        title: 'There is an error.',
        message: message
    };
};

module.exports = { message };