import { cliArguments } from 'cli-argument-parser';
import { expect } from 'chai'
import { RedisBloom } from '../modules/redisbloom';
import * as decode from 'unidecode'
let client: RedisBloom;
const key1 = 'key1bloom';
const key2 = 'key2bloom';
const key3 = 'k1';
const item1 = 'item1';
const responses: [number, Buffer][] = []
let dataIterator: number;
let data: string;
import { StringDecoder } from 'string_decoder'
describe('RedisBloom Module testing', async function() {
    before(async () => {
        client = new RedisBloom({
            host: cliArguments.host,
            port: parseInt(cliArguments.port),
        });
        await client.connect();
    })
    after(async () => {
        await client.disconnect();
    })
    it('reserve function', async () => {
        let response = await client.reserve(key2, 0.1, 1);
        expect(response).to.equal('OK', 'The response of the \'BF.RESERVE\' command');
        response = await client.reserve(key3, 0.01, 100);
        expect(response).to.equal('OK', 'The response of the \'BF.RESERVE\' command');
    })
    it('add function', async () => {
        let response = await client.add(key1, item1)
        expect(response).to.equal(1, 'The response of the \'BF.ADD\' command')
        response = await client.add(key3, '1')
        expect(response).to.equal(1, 'The response of the \'BF.ADD\' command')
    });
    it('madd function', async () => {
        const response = await client.madd(key1, [item1])
        expect(response[0]).to.equal(0, 'The response of the \'BF.MADD\' command')
    });
    it('insert function', async () => {
        const response = await client.insert(key1, [item1])
        expect(response[0]).to.equal(0, 'The response of the \'BF.INSERT\' command')
    });
    it('exists function', async () => {
        const response = await client.exists(key1, item1)
        expect(response).to.equal(1, 'The response of the \'BF.EXISTS\' command')
    });
    it('mexists function', async () => {
        const response = await client.mexists(key1, [item1])
        expect(response[0]).to.equal(1, 'The response of the \'BF.MEXISTS\' command')
    });
    it('info function', async () => {
        const response = await client.info(key1)
        expect(response[0]).to.equal('Capacity', 'The first item of the information')
        expect(response[1]).to.equal(100, 'The value of the \'Capacity\' item')
    });
    it('scandump function', async () => {
        //let response = await client.scandump(key3, 0)
        ////console.log(response)
        //
        //dataIterator = response[0]
        //expect(dataIterator).to.equal(1, 'The chunk data iterator');
        //while(dataIterator > 0){
        //    responses.push(response);
        //    response = await client.scandump(key3, dataIterator)
        //    //console.log(response)
        //    dataIterator = response[0]
        //    //const decoder = new StringDecoder('utf16le');
        //    //const cent = Buffer.from(response[1]);
        //    //console.log(decoder.write(cent));
        //}
        //for(let i = 0; i < responses[0][1].length; i++) {
        //    console.log(responses[0][1][i]);
        //}
        //const buffer = Buffer.from(response[1], 'hex');
        //console.log(buffer.toString())
        //data = buffer.toString('hex')//Buffer.from(response[1], 'utf16');//Buffer.from(response[1]).toString();
        //console.log(data)
        await client.reserve('1', 0.01, 100);
        await client.add('1', '1');
        await client.add('1', '2');
        await client.add('1', '3');
        const response = await client.scandump('1', 0);
        responses.push(response);
        console.log(responses)
        //expect(data).to.not.equal('', 'The chunk data')
    });
    it('loadchunk function', async () => {
        //await client.redis.del(key3);
        const data = "\x03\x00\x00\x00\x00\x00\x00\x00\x01\x00\x00\x00\x05\x00\x00\x00\x02\x00\x00\x00\x90\x00\x00\x00\x00\x00\x00\x00\x80\x04\x00\x00\x00\x00\x00\x00\x03\x00\x00\x00\x00\x00\x00\x00{\x14\xaeG\xe1zt?\xe9\x86/\xb25\x0e&@\b\x00\x00\x00d\x00\x00\x00\x00\x00\x00\x00\x00";
        console.log(decode(data))
        const buffer = Buffer.from(data, 'binary');
        console.log(buffer.toString('ascii'))
        console.log(buffer.toString('binary'))
        console.log(await client.loadchunk('2', 1, buffer));
        //for(const res of responses) {
        //    //console.log(`\n=== ${res[0]} ===`)
        //    //console.log(Buffer.from(res[1], 'ascii').toString('hex'))
        //    //console.log(Buffer.from(res[1], 'ascii').toString('ascii'))
        //    //console.log(Buffer.from(res[1], 'ascii').toString('base64'))
        //    //console.log(Buffer.from(res[1], 'ascii').toString('binary'))
        //    //console.log(Buffer.from(res[1], 'ascii').toString('utf-8'))
        //    //console.log(Buffer.from(res[1], 'ascii').toString('utf8'))
        //    //console.log(Buffer.from(res[1], 'ascii').toString('utf16le'))
        //    console.log(await client.loadchunk(key3, res[0], res[1]))
        //}
        //const response = await client.loadchunk(key2, dataIterator, data)
        //console.log(response)
    });
});