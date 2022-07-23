import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import useAxiosPrivate from '../hooks/useAxiosPrivate.js';
import './DisplayLists.css';

import IssueList from '../components/IssueList.js';

export default function DisplayLists(props) {

    const [data, setData] = useState([]);
    const [lists, setLists] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const axiosPrivate = useAxiosPrivate();

    const createNewList = async () => {
        try {
            const response = await axiosPrivate.post('/issueList/create', {
                name: 'New list',
                position: lists.length,
                containerid: props.containerid
            });
            getLists();

        } catch (err) {
            console.log(err);
            navigate('/login', { state: { from: location }, replace: true });
        }
    }

    const getLists = async () => {
        try {
            const response = await axiosPrivate.get('/issueList/?containerid=' + props.containerid);
            if(response?.data !== data) {
                setData(response?.data);
            }
        } catch (err) {
            console.log(err);
            navigate('/login', { state: { from: location }, replace: true });
        }
    }

    const removeList = async (listid) => {
        setLists(prev => prev.filter((list) => {return list.props.listid !== listid}));

        try {
            const response = await axiosPrivate.get('/issueList/remove?listid=' + listid);
            syncListPosition(listid);

        } catch (err) {
            console.log(err);
            navigate('/login', { state: { from: location }, replace: true });
        }
    }

    const updateList = async (list) => {
        try {
            const response = await axiosPrivate.post('/issueList/update', {
                id: list.id,
                name: list.name,
                position: list.position,
            });
        } catch (err) {
            console.log(err);
            navigate('/login', { state: { from: location }, replace: true });
        }
    }

    const syncListPosition = (listid) => {
        let allData = data.filter((list) => {return list.id !== listid});
        for (let i = 0; i < allData.length; i++) {
            if(allData[i].position !== i) {
                allData[i].position = i;
                updateList(allData[i]);
            }
        }
    }

    useEffect(() => {
        if(data.length > 0) {
            let allLists = [];
            for (let i = 0; i < data.length; i++) {
                let list = data[i];
                // Sort if needed
                if (list.position < i) {
                    allLists.push(allLists[list.position]);
                    allLists[list.position] = <IssueList 
                        key={list.id} 
                        remove={removeList}
                        update={updateList}
                        listid={list.id}
                        position={list.position} 
                        name={list.name}
                        />;
                } else {
                    allLists.push(<IssueList 
                        key={list.id} 
                        remove={removeList}
                        update={updateList}
                        listid={list.id}
                        position={list.position} 
                        name={list.name}
                        />);
                }
            }
            setLists(allLists);
        }
    }, [data]);


    useEffect(() => {
        getLists();
    }, []);

    return (
        <div className="IssueListsContainer">
            { lists }
            <button className="NewListBtn" onClick={createNewList}>New list</button>
        </div>
    )
}
