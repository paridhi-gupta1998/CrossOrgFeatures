import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Accordion, Alert, Badge, Form, Button, ListGroup } from 'react-bootstrap';



function Milestone({ userdata, feature, repos, get_api, api, git_api, load_repo_message }) {
    const [milestone, setMilestone] = useState({});
    const [milestone_method, setMileStoneMethod] = useState("CREATE")

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

    const handleSubmitMilestone = (evt) => {
        evt.preventDefault();
        let milestone_url = "repos/" + userdata.username + "/" + 'portal' + "/milestones"


        repos.map(repo => {

            let milestone_url = "repos/" + userdata.username + "/" + repo + "/milestones"
            if (milestone_method == "CREATE")
                create_milestone(milestone_url)
            else if (milestone_method == "UPDATE")
                update_milestone(milestone_url, milestone['title'])
            else if (milestone_method == "DELETE")
                delete_milestone(milestone_url, milestone['title'])
        }

        )
    }

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
    return (
        <Row className="g-12" className="justify-content-md-center">

            {feature && feature === "milestone_feature" ?


                <Col md={4}>
                    {repos && repos.length > 0 ?
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
                        </Container> : <p style={{ color: "red" }}>{load_repo_message}</p>}
                </Col> : undefined
            }
        </Row>
    )
}
export default Milestone;