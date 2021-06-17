import React, {useEffect, useState} from 'react';
import axios from 'axios';

const Fib = () => {
    const [seenIndexes, setSeenIndexes] = useState([]);
    const [values, setValues] = useState({});
    const [index, setIndex] = useState('');

    useEffect(()=>{
        const getData = async () => {
            const values = await axios.get('/api/values/current')
            setValues(values.data);
            const indexes = await axios.get('/api/values/all');
            setSeenIndexes(indexes.data);
        }
        getData();
    }, [])

    const renderSeenIndexes = () => {

        return seenIndexes && seenIndexes.map(({number}) => number).join(',');
    }
    const renderValues = () => {
        const entries = []
        for (let key in values) {
            entries.push((
                <div key={key}>
                    For Index {key} I calculated {values[key]}
                </div>
            ))
        }
        return entries;
    }
    const handleSubmit = async (event) => {
        event.preventDefault();

        await axios.post('/api/values',{
            index:index
        });
        setIndex('');
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Enter your index</label>
                <input value={index} onChange={event => {
                    setIndex(event.target.value);
                }}/>
                <button>Submit</button>
            </form>

            <h3>Indexes I have seen:</h3>
            {renderSeenIndexes()}

            <h3>Calculated Values:</h3>
            {renderValues()}
        </div>
    );
};

export default Fib;