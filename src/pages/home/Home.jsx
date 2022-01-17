// import React, { Component, useState, useEffect } from "react"
// import {
//   Row,
//   Col,
//   Popover,
//   Steps,
//   Form,
//   Input,
//   Button,
//   Pagination,
//   Typography,
//   Space,
//   message
// } from "antd"
// import "antd/dist/antd.css"
// import Recording from "../../components/Recording"

// const { Step } = Steps
// const { Title } = Typography

// // function customDot(dot, { status, index }) {
// //   return (
// //     <Popover
// //       content={
// //         <span>
// //           step {index} status: {status}
// //         </span>
// //       }
// //     >
// //       {dot}
// //     </Popover>
// //   )
// // }

// const layout = {
//   labelCol: {
//     span: 24
//   },
//   wrapperCol: {
//     span: 24
//   }
// }
// /* eslint-disable no-template-curly-in-string */

// const validateMessages = {
//   required: "${label} is required!",
//   types: {
//     email: "${label} is not a valid email!",
//     number: "${label} is not a valid number!"
//   },
//   number: {
//     range: "${label} must be between ${min} and ${max}"
//   }
// }
// /* eslint-enable no-template-curly-in-string */

// const onFinish = values => {
//   console.log(values)
// }

// export default function Home() {
//   const [current, setCurrent] = useState(0)
//   const [currentBottomProgress, setCurrentBottomProgress] = useState(1)
//   const [isLoading, setIsLoading] = useState(true)

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsLoading(false)
//     }, 1000)
//     return () => clearTimeout(timer)
//   }, [])

//   const steps = [
//     {
//       title: "First",
//       content: (
//         <Form.Item
//           rules={[
//             {
//               required: false
//             }
//           ]}
//         >
//           <Title level={2}>Please, choose a path</Title>
//           <Space size={[8, 16]} align="center" size={150}>
//             <Button onClick={() => next()}>active giver</Button>
//             <Button>meditative observatory</Button>
//           </Space>
//         </Form.Item>
//       )
//     },
//     {
//       title: "Second",
//       content: (
//         <Form.Item
//           rules={[
//             {
//               required: false
//             }
//           ]}
//         >
//           <Title level={2}>
//             Please guide us towards your inner self for an accurate future
//             result
//           </Title>
//         </Form.Item>
//       )
//     }
//   ]

//   const next = () => {
//     setCurrent(current + 1)
//   }

//   const prev = () => {
//     setCurrent(current - 1)
//   }

//   return (
//     <>
//       {isLoading ? (
//         <div className="load">
//           <div>...loading</div>
//         </div>
//       ) : (
//         <Row className="homepage">
//           <Col span={24}>
//             {currentBottomProgress === 0 && (
//               <div className="form-area">
//                 <Form
//                   {...layout}
//                   name="nest-messages"
//                   onFinish={onFinish}
//                   validateMessages={validateMessages}
//                 >
//                   <div className="steps-content">{steps[current].content}</div>
//                   <div className="steps-action"></div>
//                 </Form>
//               </div>
//             )}
//             {currentBottomProgress === 1 && (
//               <div className="recording-area">
//                 <Recording />
//               </div>
//             )}
//           </Col>
//           <Col span={24}>
//             <Step title="Onboarding" description="You can hover on the dot." />
//             <Step title="Recording" description="You can hover on the dot." />
//             <Step
//               title="Transformation"
//               description="You can hover on the dot."
//             />
//             {/* </Steps> */}
//           </Col>
//         </Row>
//       )}
//     </>
//   )
// }
