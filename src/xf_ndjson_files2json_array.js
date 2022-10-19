import parse from 'ndjson-parse'
import { readdir, readFile, writeFile } from 'fs/promises'
import { PinpointClient, DeleteUserEndpointsCommand, DeleteEndpointCommand } from '@aws-sdk/client-pinpoint'
import dotenv from 'dotenv'

dotenv.config()

const accessKeyId = process.env.ACCESS_KEY_ID
const secretAccessKey = process.env.SECRET_ACCESS_KEY
const ApplicationId = process.env.PINPOINT_APP_ID

const client = new PinpointClient({
    region: 'us-east-1',
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
})

const delist = async (event) => {
    const { rawPath, rawQueryString } = event

    const path = rawPath.substr(1)
    const query = rawQueryString ? '?' + rawQueryString : ''
    const UserId = path + query
    const body = await readFile('./sorry.html', { encoding: 'utf8' })

    if (!UserId) {
        console.warn('No User Found:', UserId)
        return
    }

    try {
        const command = new DeleteUserEndpointsCommand({
            ApplicationId,
            UserId,
        })

        console.log('Attempting to delete endpoints for UserId:', UserId, '...')
        const response = await client.send(command)
        console.log({ response })
    } catch (err) {
        console.error('Caught error:', err)
        return
    }
}

const delistAllBouncedEmails = async ({ path = 'halls_teaser/events/bundle.json' } = {}) => {
    const pojo = await readFile(path).then(JSON.parse)
    //console.log({ pojo })
    await pojo.forEach(c => {
        const { event_type } = c
        if (event_type === "_email.hardbounce") {
            try {
                const command = new DeleteEndpointCommand({
                    ApplicationId,
                    EndpointId,
                })
        
                console.log('Attempting to delete endpoints for UserId:', UserId, '...')
                const response = await client.send(command)
                console.log({ response })
            } catch (err) {
                console.error('Caught error:', err)
                return
            }
        }
    })
}

delistAllBouncedEmails() //?

const xf_ndjson_files2json_array = async ({ path = './halls_teaser/events/' } = {}) => {
    const filenames = await readdir(path)
    const files = await filenames.reduce(async (acc, filename) => {
        const _acc = await acc

        const json_arr = await readFile(path + filename, { encoding: 'utf8' }).then(parse)
        return [..._acc, ...json_arr]
    }, Promise.resolve([]))

    const bundle_name = 'bundle.json'
    return await writeFile(path + bundle_name, JSON.stringify(files, null, 2)).then(() =>
        console.log('DONE: bundle.json')
    )
    //console.log({ files })
}

//xf_ndjson_files2json_array() //?
