import React, { useEffect, useState } from 'react'
import './Quiz.css'
import axios from 'axios'

const Quiz = () => {

    const [questions, setQuestions] = useState([])
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [lock, setLock] = useState(false)
    const [shuffledAnswers, setShuffledAnswers] = useState([])
    const [clickedAnswers, setClickedAnswers] = useState([])
    const answerListRef = React.useRef([])
    const [score, setScore] = useState(0)
    const [result, setResult] = useState(false)

    const sanitizeText = (text) => {
        const doc = new DOMParser().parseFromString(text, 'text/html');
        return doc.body.textContent || "";
      };

    const handleNextQuestion = ()=>{
       
            if(lock===true){

                if(currentQuestionIndex=== questions.length -1){
                    setResult(true)
                    return;

                }
                answerListRef.current.forEach((item)=>{

                    if (item){
                        item.classList.remove('correct', 'wrong')

                    }
                   
                });
                
                    setCurrentQuestionIndex(currentQuestionIndex+1);
                    setLock(false)
                    setClickedAnswers([])
                
           
        }

    }

    useEffect(()=>{
        if(questions.length>0 && questions[currentQuestionIndex]){
                    const allAnswers = questions[currentQuestionIndex]
                    ?[...questions[currentQuestionIndex].incorrect_answers, questions[currentQuestionIndex]?.correct_answer ]
                    : [];
                    allAnswers.sort(()=>Math.random() - 0.5)

                    setShuffledAnswers(allAnswers)
                    }
                },[questions, currentQuestionIndex])
    

    const checkAns = (e,answer)=>{

        if(lock===false){
        if(questions[currentQuestionIndex]?.correct_answer===answer){
            e.target.classList.add('correct');
            setScore(score+1)
           

        }
        else{
            e.target.classList.add('wrong');

            answerListRef.current.forEach((item) => {
                if (item && item.textContent === questions[currentQuestionIndex]?.correct_answer) {
                  item.classList.add('correct');
                }
              });
            
            
        }
        setClickedAnswers((prev)=> [...prev,answer])
        setLock(true)
    }
    }

    useEffect(()=>{
        const source = axios.CancelToken.source();
        axios.get('https://opentdb.com/api.php?amount=10&category=28')
        .then(response => {
           setQuestions(response.data.results)
        })
        .catch(error=>{
            console.log('error occured', error)
        })
        return ()=>{
            source.cancel('Request cancelled by cleanup')

        }


    },[])


    const reset = ()=>{
        setCurrentQuestionIndex(0);
        setScore(0)
        setLock(false)
        setResult(false)
    }
  return (
    <div className='container'>
        <h1>Quiz App</h1>
        <hr />

        {
           result ? (<>   <h2>You Scored : {score} out of {questions.length}</h2>
           <button onClick={reset}>Reset</button>
          </> ): (<> <h2>{currentQuestionIndex+1}. {questions[currentQuestionIndex] ? sanitizeText(questions[currentQuestionIndex].question) : 'Loading question...Try refreshing'}</h2>
        <ul>
           {shuffledAnswers.map((answer,index)=> (
            <li key={index} 
            ref={(el)=> (answerListRef.current[index] = el)}
            onClick={(e)=>checkAns(e,answer)}>{sanitizeText(answer)}</li>
           ))}
        </ul>
        <button onClick={handleNextQuestion}>{currentQuestionIndex<questions.length-1 ?  'Next' :'Show Result'}</button>
        <div className="index">
            {currentQuestionIndex+1} of {questions.length} questions
           
        </div></>)
           
           
           
           
          
        }
        
    </div>
  )
}

export default Quiz