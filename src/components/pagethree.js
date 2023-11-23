import axios from "axios"
import { Card, Col, Container, Row, Accordion, Button } from "react-bootstrap"


function Summary(props) {
    return (<Container>
        <Row style={{ 'text-align': 'left' }}>
            <Card>
                <Card.Body>
                    <Accordion defaultActiveKey="0">
                        <Accordion.Item eventKey="0" >
                            <Accordion.Header>pickup info</Accordion.Header>
                            <Accordion.Body>
                                <Row>
                                    <Col >
                                        出发日期:
                                    </Col>
                                    <Col style={{ 'marginLeft': 'auto', textAlign: 'right' }}>
                                        {props.data_date}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        出发时间:
                                    </Col>
                                    <Col style={{ 'marginLeft': 'auto', textAlign: 'right' }}>
                                        {props.data_time}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        出发地点:
                                    </Col>
                                    <Col style={{ 'marginLeft': 'auto', textAlign: 'right', overflow: 'hidden' }}>
                                        {props.data_start}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        抵达地点:
                                    </Col>
                                    <Col style={{ 'marginLeft': 'auto', textAlign: 'right', overflow: 'hidden' }}>
                                        {props.data_end === "17801 International Blvd, SeaTac, WA 98158" ? 'SeaTac' : props.data_end}
                                    </Col>
                                </Row>

                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1">
                            <Accordion.Header><Row style={{ 'width': '100%' }}><Col>distance fee:</Col><Col style={{ 'marginLeft': 'auto', textAlign: 'right' }}>{props.data_dropofftotal}</Col></Row></Accordion.Header>
                            <Accordion.Body>
                                <Row>
                                    <Col>
                                        距离:
                                    </Col>
                                    <Col style={{ 'marginLeft': 'auto', textAlign: 'right' }}>
                                        {props.data_dropoffdis + ' miles'}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        单价:
                                    </Col>
                                    <Col style={{ 'marginLeft': 'auto', textAlign: 'right' }}>
                                        {'$' + props.data_dropoffprice}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        总计:
                                    </Col>
                                    <Col style={{ 'marginLeft': 'auto', textAlign: 'right' }}>
                                        {'$' + props.data_dropofftotal}
                                    </Col>
                                </Row>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="2">
                            <Accordion.Header><Row style={{ 'width': '100%' }}><Col>pickup fee:</Col><Col style={{ 'marginLeft': 'auto', textAlign: 'right' }}>{props.data_pickuptotal}</Col></Row></Accordion.Header>
                            <Accordion.Body>
                                <Row>
                                    <Col>8miles 内减免
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        距离:
                                    </Col>
                                    <Col style={{ 'marginLeft': 'auto', textAlign: 'right' }}>
                                        {props.data_pickupdis + ' miles'}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        单价:
                                    </Col>
                                    <Col style={{ 'marginLeft': 'auto', textAlign: 'right' }}>
                                        {'$' + props.data_pickupprices}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        总计:
                                    </Col>
                                    <Col style={{ 'marginLeft': 'auto', textAlign: 'right' }}>
                                        {'$' + props.data_pickuptotal}
                                    </Col>
                                </Row>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                    <Row><Col><Button onClick={() => [
                        axios.get('/book', (req, res) => {
                            console.log(res.data);
                        })
                    ]}>确认行程</Button></Col></Row>
                </Card.Body>
            </Card>
        </Row>
    </Container>)
}
export default Summary