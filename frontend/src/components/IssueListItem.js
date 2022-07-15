import { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical, faCheck } from '@fortawesome/free-solid-svg-icons';

import "./IssueListItem.css";

export default function IssueListItem(props) {

    const [name, setName] = useState(props.name);
    
    const removeIssue = () => {
        props.remove(props.issueid);
    }

    return (
        <div className="issue-list-item">
            <input type='text' value={name} className="issue-name" onChange={(e) => (setName(e.target.value))}/>
            <button onClick={removeIssue}><FontAwesomeIcon icon={faEllipsisVertical} /></button>
        </div>
    )
}
