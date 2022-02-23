import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Accordion, Alert, Badge, Form, Button, ListGroup } from 'react-bootstrap';




const git_api = "https://api.github.com/"


function Home({ username, pat }) {

    const [repos, setRepos] = useState([]);
    const [milestone, setMilestone] = useState({});
    const [label, setLabel] = useState({ color: 'fbca04' });
    const [milestone_method, setMileStoneMethod] = useState("CREATE")
    const [label_method, setLabeleMethod] = useState("CREATE")
    const [color, setColor] = useState("fbca04")
    const [feature, setFeature] = useState("")



    // Repo Related Functions

    let get_repos = (repos) => {
        let repositories = []
        repos.map(repo => repo['archived'] == false && repo['disabled'] == false && repositories.push(repo['name']))
        return repositories;

    }

    useEffect(() => {

        let repo_data = get_api(git_api + "users/" + username + "/repos", 'GET')
        repo_data.then(data => {
            let repo_list = get_repos(data)
            setRepos(repo_list)
        }

        )

    }, []);




    // MileStone Related Functions

    let get_milestone_number = (milestones_list, name) => {
        let num = false
        for (let ml of milestones_list) {
            if (ml['title'] == name) {
                return ml['number']
            }
        }
        return false

    }
    let update_milestone = (milestone_url, name) => {
        let milestone_list = api(git_api + milestone_url, 'GET')
        milestone_list.then(list => {
            let ml_number = get_milestone_number(list, name)
            if (ml_number) {
                milestone_url = milestone_url + `/${ml_number}`
                let temp_milestone = milestone
                if (milestone['rename']) {
                    temp_milestone['title'] = milestone['rename']
                    delete temp_milestone['rename']
                }
                api(git_api + milestone_url, 'PATCH', temp_milestone)
            }
        }
        )
    }
    let create_milestone = (milestone_url) => {
        let repo_data = api(git_api + milestone_url, 'POST', milestone)
    }

    let delete_milestone = (milestone_url, name) => {
        let milestone_list = api(git_api + milestone_url, 'GET')
        milestone_list.then(list => {
            let ml_number = get_milestone_number(list, name)
            if (ml_number) {
                milestone_url = milestone_url + `/${ml_number}`
                api(git_api + milestone_url, 'DELETE')
            }

        })
    }

    // Label related functions

    let get_label_number = (labels_list, name) => {
        for (let ll of labels_list) {
            if (ll['name'] == name) {
                return ll['url']
            }
        }
        return false

    }
    let update_label = (label_url, name) => {
        let label_list = api(git_api + label_url, 'GET')
        label_list.then(list => {
            let ll_url = get_label_number(list, name)
            if (ll_url) {
                let temp_label = label
                if (label['rename']) {
                    temp_label['name'] = temp_label['rename']
                    delete temp_label['rename']
                }
                api(ll_url, 'PATCH', temp_label)
            }
        }
        )
    }

    let create_label = (label_url) => {
        let repo_data = api(git_api + label_url, 'POST', label)
    }

    let delete_label = (label_url, name) => {
        let label_list = api(git_api + label_url, 'GET')

        label_list.then(list => {
            let ll_url = get_label_number(list, name)
            if (ll_url) {
                api(ll_url, 'DELETE')
            }

        })
    }

    let color_generator = () => {
        let temp = Math.floor(Math.random() * 16777215).toString(16);
        setColor(temp);
        handleLabelInputs('color', temp)

    }

    // RECURSIVE GET API : Because of Rate limit
    let get_api = (url, method, api_data, limit = 30, page = 1) => {


        url = url.split('?')[0] + `?page=${page}`
        let response = api(url, method, api_data, page)
        response.then(res => {
            if (Object.keys(res).length == limit) {
                let inner_res = get_api(url, method, api_data, page + 1)
                inner_res.then(inner => {
                    return { ...res, ...inner }
                }

                )
            }
            else {
                return res
            }
        }
        )
        return response

    }

    // Git API Call
    let api = (url, method, api_data) => {
        if (method && method != 'GET') {
            if (!username && !pat) {
                alert("Error: Please enter username and personal access token")
                throw ("No Username and Personal Access Token")
            }
        }

        let response = fetch(url, {
            method: method,
            mode: 'cors', // no-cors, *cors, same-origin
            headers: {
                'Accept': 'application/vnd.github.inertia-preview+json',
                "Content-Type": "application/json",
                "Authorization": 'Basic ' + btoa(`${username}:${pat}`)


            },
            body: JSON.stringify(api_data)
        }).then(response => response.json())
            .then(data => {
                console.log(data, method)
                return data
            })
            .catch(error => console.log(error,))
        return response



    }
    // main function after submit button is pressed
    const handleSubmitMilestone = (evt) => {
        evt.preventDefault();
        let milestone_url = "repos/" + username + "/" + 'portal' + "/milestones"


        repos.map(repo => {

            let milestone_url = "repos/" + username + "/" + repo + "/milestones"
            if (milestone_method == "CREATE")
                create_milestone(milestone_url)
            else if (milestone_method == "UPDATE")
                update_milestone(milestone_url, milestone['title'])
            else if (milestone_method == "DELETE")
                delete_milestone(milestone_url, milestone['title'])
        }

        )
    }

    const handleSubmitLabel = (evt) => {
        evt.preventDefault();
        let label_url = "repos/" + username + "/" + 'portal' + "/labels"
        repos.map(repo => {

            let label_url = "repos/" + username + "/" + repo + "/labels"
            if (label_method == "CREATE")
                create_label(label_url)
            else if (label_method == "UPDATE")
                update_label(label_url, label['name'])
            else if (label_method == "DELETE")
                delete_label(label_url, label['name'])
        }
        )
    }
    // Function to set state for inputs
    const handleMilestoneInputs = (type, value) => {

        if (value) {
            let temp_milestone = milestone
            if (type == 'due_on')
                value += "T00:00:00Z"
            temp_milestone[type] = value
            setMilestone({ ...temp_milestone })
        }
        else {
            let temp_milestone = milestone
            delete temp_milestone[type]
            setMilestone({ ...temp_milestone })
        }
    }

    const handleLabelInputs = (type, value) => {
        if (value) {
            let temp_label = label
            temp_label[type] = value
            setLabel({ ...temp_label })
        }
        else {
            let temp_label = label
            delete temp_label[type]
            setLabel({ ...temp_label })
        }
    }

    const selectfeature = (e) => {
        setFeature(e.target.id)
    }


    return (
        <>

            {/* Bootstrap and Fa-Fa-icon link */}
            <link href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css" rel="stylesheet" />
            {/* {repos && repos.length == 0 && set_repo()} */}
            <br />
            <br />
            <Row className="g-12" className="justify-content-md-center">
                <Col md={4}>
                    {repos && <h4>TOTAL REPOSITORIES: {repos.length}</h4>}
                    {repos &&
                        <Accordion defaultActiveKey={['0']} flush >
                            <Accordion.Item eventKey="0" >
                                <Accordion.Header>REPOSITORY NAMES</Accordion.Header>
                                <Accordion.Body>
                                    <ListGroup>
                                        {repos.map(repo => <ListGroup.Item>{repo}</ListGroup.Item>
                                        )}
                                    </ListGroup>

                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    }

                </Col>

            </Row>
            <hr/>
            {repos &&
                <Row className="g-12" className="d-flex align-items-end justify-content-md-center">
                    <Col md={1}>
                        <Form.Group className="mb-5">
                            <Button id="milestone_feature" bsStyle="link" onClick={selectfeature}>MILESTONES</Button>
                        </Form.Group>
                    </Col>
                    <Col md={1}>
                        <Form.Group className="mb-5">
                            <Button id="label_feature" bsStyle="link" onClick={selectfeature}>LABELS</Button>
                        </Form.Group>
                    </Col>
                </Row>
            }


            <Row className="g-12" className="justify-content-md-center">

                {feature && feature === "milestone_feature" ?

                    <Col md={4}>
                        <Container>
                            <h1> Milestones </h1>
                            <Form onSubmit={handleSubmitMilestone} >
                                <fieldset>
                                    <Form.Group className="mb-5">
                                        <Form.Label htmlFor="disabledTextInput">Name</Form.Label>
                                        <Form.Control id="milestone-name" onChange={e => handleMilestoneInputs('title', e.target.value)} required />
                                    </Form.Group>
                                    <Form.Group className="mb-5">
                                        <Form.Label htmlFor="disabledTextInput">Description</Form.Label>
                                        <Form.Control as="textarea" id="milestone-description" rows={3} onChange={e => handleMilestoneInputs('description', e.target.value)} />
                                    </Form.Group>
                                    <Form.Group className="mb-5">
                                        <Form.Label htmlFor="disabledTextInput">Due Date</Form.Label>
                                        <Form.Control type="date" name='date_of_birth' onChange={e => handleMilestoneInputs('due_on', e.target.value)} />
                                        {/* <Form.Control id="milestone-due" onChange={e => setMilestone({ ...milestone, "due_date": e.target.value })} /> */}
                                    </Form.Group>
                                    <Form.Group className="mb-5">
                                        <Form.Label htmlFor="disabledSelect">Operation: </Form.Label>
                                        <Form.Select id="milestoneMethod" onChange={e => setMileStoneMethod(e.target.value)} >
                                            <option>CREATE</option>
                                            <option>UPDATE</option>
                                            <option>DELETE</option>
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group className="mb-5">
                                        <Form.Label htmlFor="disabledTextInput">Rename</Form.Label>
                                        <Form.Control id="milestone-rename" onChange={e => handleMilestoneInputs('rename', e.target.value)} />
                                        <Form.Text className="text-muted">
                                            Fill this when you want to update the name
                                        </Form.Text>
                                    </Form.Group>
                                    <Button style={{ backgroundColor: "#e87722" }} type="submit">Submit</Button>
                                </fieldset>
                            </Form>
                        </Container>
                    </Col> : undefined
                }

                {feature && feature === "label_feature" ?
                    <Col md={4}>
                        <Container>
                            <h1> Labels</h1>

                            <Form onSubmit={handleSubmitLabel}>
                                <fieldset>
                                    <Form.Group className="mb-5">
                                        <Form.Label htmlFor="disabledTextInput">Name</Form.Label>
                                        <Form.Control id="label-name" onChange={e => handleLabelInputs('name', e.target.value)} required />
                                    </Form.Group>
                                    <Form.Group className="mb-5">
                                        <Form.Label htmlFor="disabledTextInput">Description</Form.Label>
                                        <Form.Control as="textarea" id="label-description" rows={3} onChange={e => handleLabelInputs('description', e.target.value)} />
                                    </Form.Group>
                                    <Form.Group className="mb-5">
                                        <Form.Label htmlFor="disabledTextInput">Color</Form.Label>
                                        <Row>
                                            <Col md={4}>
                                                <Form.Control id="color" value={label.color} onChange={e => handleLabelInputs('color', e.target.value)} />
                                            </Col>
                                            <Col md={4}>
                                                <p style={{ backgroundColor: '#' + color }}>{color}</p>
                                            </Col>
                                            <Col md={4}>
                                                <Button onClick={() => color_generator()}>Next color</Button>
                                            </Col>
                                        </Row>


                                    </Form.Group>
                                    <Form.Group className="mb-5">
                                        <Form.Label htmlFor="disabledSelect">Operation: </Form.Label>
                                        <Form.Select id="labelMethod" onChange={e => setLabeleMethod(e.target.value)} >
                                            <option>CREATE</option>
                                            <option>UPDATE</option>
                                            <option>DELETE</option>
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group className="mb-5">
                                        <Form.Label htmlFor="disabledTextInput">Rename</Form.Label>
                                        <Form.Control id="label-rename" onChange={e => handleLabelInputs('rename', e.target.value)} />
                                        <Form.Text className="text-muted">
                                            Fill this when you want to update the name
                                        </Form.Text>
                                    </Form.Group>
                                    <Button style={{ backgroundColor: "#e87722" }} type="submit">Submit</Button>
                                </fieldset>
                            </Form>
                        </Container>
                    </Col> : undefined
                }

            </Row>
            <br />
        </>
    );

}
export default Home;