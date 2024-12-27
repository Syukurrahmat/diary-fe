export default function Log({data} : {data : any}) {
    return <pre>{JSON.stringify(data, null, 4)}</pre>
};
