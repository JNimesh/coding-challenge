import React, {useState, useEffect} from 'react';

const ISSUE_URL = 'http://localhost:4000/api/issues';

function IssuesPage() {
    const [issues, setIssues] = useState([]);
    const [mode, setMode] = useState('LIST_VIEW'); // "CREATE", "EDIT", or "LIST_VIEW"
    const [currentIssue, setCurrentIssue] = useState(null); // For editing an issue

    useEffect(() => {
        const fetchIssues = async () => {
            try {
                const response = await fetch(ISSUE_URL);
                const data = await response.json();
                setIssues(data);
            } catch (error) {
                console.error('Error fetching issues:', error);
            }
        };
        fetchIssues();
    }, []);

    const handleDelete = async (id) => {
        try {
            await fetch(`${ISSUE_URL}/${id}`, {
                method: 'DELETE',
            });
            setIssues(issues.filter(issue => issue.id !== id));
        } catch (error) {
            console.error('Error deleting issue:', error);
        }
    };

    const handleEdit = (id) => {
        const issueToEdit = issues.find(issue => issue.id === id);
        setCurrentIssue(issueToEdit);
        setMode('EDIT');
    };

    const handleCreate = () => {
        setMode('CREATE');
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const issueData = {
            title: formData.get('title'), description: formData.get('description')
        };

        try {
            let response;
            if (mode === 'CREATE') {
                response = await fetch(ISSUE_URL, {
                    method: 'POST', headers: {
                        'Content-Type': 'application/json',
                    }, body: JSON.stringify(issueData)
                });
            } else if (mode === 'EDIT' && currentIssue) {
                response = await fetch(`${ISSUE_URL}/${currentIssue.id}`, {
                    method: 'PUT', headers: {
                        'Content-Type': 'application/json',
                    }, body: JSON.stringify(issueData)
                });
            }
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            } else {
                // Refresh the issues list after a successful operation
                const updatedIssueList = await fetch(ISSUE_URL);
                const data = await updatedIssueList.json();
                setIssues(data);
            }
            setMode('LIST_VIEW');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (<div>
        {mode === 'LIST_VIEW' && (<>
            <div className="page-header">
                <h2 className="title">Issues</h2>
                <button className="primary" onClick={handleCreate}>Create Issue</button>
            </div>
            <table>
                <thead>
                <tr>
                    <th className="title">Name</th>
                    <th className="title">Description</th>
                    <th className="title">Actions</th>
                </tr>
                </thead>
                <tbody>
                {issues.map(issue => (<tr key={issue.id}>
                    <td>{issue.title}</td>
                    <td>{issue.description}</td>
                    <td>
                        <button className="primary" onClick={() => handleEdit(issue.id)}>Edit</button>
                        <button className="secondary" onClick={() => handleDelete(issue.id)}>Delete</button>
                    </td>
                </tr>))}
                </tbody>
            </table>
        </>)}

        {(mode === 'CREATE' || mode === 'EDIT') && (<>
            <div className="page-header">
                <h2 className="title">Issues</h2>
            </div>
            <form onSubmit={handleFormSubmit}>
                <div className="form-container">
                    <div className="form-field">
                        <label>Title: </label>
                        <input
                            type="text"
                            defaultValue={mode === 'EDIT' ? currentIssue.title : ''}
                            name="title"
                        />
                    </div>
                    <div className="form-field">
                        <label>Description: </label>
                        <textarea
                            defaultValue={mode === 'EDIT' ? currentIssue.description : ''}
                            name="description"
                        />
                    </div>
                    <div>
                        <button className="primary"
                                type="submit">{mode === 'EDIT' ? 'Update Issue' : 'Create Issue'}</button>
                        <button className="secondary" onClick={(event) => {
                            event.preventDefault();
                            setMode('LIST_VIEW');
                        }}>Back
                        </button>
                    </div>
                </div>
            </form>
        </>)}
    </div>);
}

export default IssuesPage;
