import { Card, Col, Container, Form, InputGroup, NavLink, Row } from "react-bootstrap";
import { Link } from 'react-router-dom'
import { date,time } from "./test";
import { useContext, useRef } from "react";


function Pageone(props) {
    const { data_date, setdate } = useContext(date)
    const { data_time, settime } = useContext(time)
    const ref_time=useRef(null)

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
                                <Form.Label>出发日期</Form.Label>
                                {/* <InputGroup>
                                <Form.Control type="input"></Form.Control>
                                <input type="date"></input>
                                </InputGroup> */}
                                <Form.Control type="date" value={data_date} onChange={(e)=>{setdate(e.currentTarget.value);console.log(e.currentTarget.value)}}/>
                                
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>出发时间</Form.Label>
                                <Form.Control type="time" value={data_time} onChange={(e)=>{settime(e.currentTarget.value);console.log(e.currentTarget.value);console.log(ref_time);}}></Form.Control>

                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>

                    </Row>
                    <Row>
                        <Col>
                            <NavLink >
                                <Link to='/pagetwo'>Next</Link>
                            </NavLink>
                        </Col>
                    </Row>

                </Form> 
                </Card.Body>
                
            </Card>
 
            </Row>
            
        </Container>
    )
}

export default Pageone;

