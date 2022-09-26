import parse from 'ndjson-parse'
import { readdir, readFile, writeFile } from 'fs/promises'

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

xf_ndjson_files2json_array() //?
