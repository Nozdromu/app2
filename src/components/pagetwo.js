import { Button, Card, Col, Container, Form, FormGroup, InputGroup, NavLink, Row } from "react-bootstrap";
import { Link } from 'react-router-dom'
import { start, end,car } from './test'
import { useContext, useState } from "react";
import {axios} from 'axios'
function Pagetwo(props) {
    const { data_start, setstart } = useContext(start);
    const { data_end, setend } = useContext(end);
    const { data_car, setcar } = useContext(car);
    return (
        <Container>
            <Row style={{ 'text-align': 'left' }}>
                <Card>
                    <Card.Header></Card.Header>
                    <Card.Body>
                        <Form>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3">
                                        <Form.Label>出发地点</Form.Label>
                                        <InputGroup>
                                            <Form.Control type="input" value={data_start} onChange={(e)=>{setstart(e.currentTarget.value)}}></Form.Control>
                                            <Button variant="outline-secondary" id="button-addon1">map</Button>
                                        </InputGroup>


                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3">
                                        <Form.Label>抵达地点</Form.Label>
                                        <Form.Check // prettier-ignore
                                            type="switch"
                                            id="des"
                                            label="seatac机场"
                                            onChange={(e) => {
                                                console.log(e.currentTarget.checked)
                                                if (e.currentTarget.checked) {
                                                    setend('17801 International Blvd, SeaTac, WA 98158')
                                                } else {
                                                    setend('')
                                                }
                                            }}
                                        />
                                        <Form.Control type="input" value={data_end} onChange={(e) => { setend(e.currentTarget.value) }}></Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <FormGroup className="mb-3">
                                        <Row>
                                            <Form.Label>车型:</Form.Label>
                                        </Row>
                                        <Row>
                                            <Form.Check
                                                inline
                                                label="sedan 1-4seat"
                                                name="group1"
                                                type='radio'
                                                id={'radio1'}
                                                onChange={()=>{
                                                    setcar('0')
                                                }}
                                                checked={true}
                                            />

                                            <Form.Check
                                                inline
                                                label="miniVan 1-7seat"
                                                name="group1"
                                                type='radio'
                                                id={'radio2'}
                                                onChange={()=>{
                                                    setcar('1')
                                                }}
                                            />

                                        </Row>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Button onClick={props.getprice}>估计费用</Button>
                                    
                                </Col>
                            </Row>

                        </Form>
                    </Card.Body>

                </Card>

            </Row >

        </Container >
    )
}

export default Pagetwo;