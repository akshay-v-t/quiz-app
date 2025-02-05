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

    const handleNextQuestion = ()=>{
       
            if(lock===true && currentQuestionIndex < questions.length-1){
                answerListRef.current.forEach((item)=>{
                    item.classList.remove('correct', 'wrong')
                })
                
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
           

        }
        else{
            e.target.classList.add('wrong');
            
        }
        setClickedAnswers((prev)=> [...prev,answer])
        setLock(true)
    }
    }

    useEffect(()=>{
        const source = axios.CancelToken.source();
        axios.get('https://opentdb.com/api.php?amount=10&category=27')
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
  return (
    <div className='container'>
        <h1>Quiz App</h1>
        <hr />
        <h2>{currentQuestionIndex+1}. {questions[currentQuestionIndex] ? questions[currentQuestionIndex].question : 'Loading question...Try refreshing'}</h2>
        <ul>
           {shuffledAnswers.map((answer,index)=> (
            <li key={index} 
            ref={(el)=> (answerListRef.current[index] = el)}
            onClick={(e)=>checkAns(e,answer)}>{answer}</li>
           ))}
        </ul>
        <button onClick={handleNextQuestion}>Next</button>
        <div className="index">
            {currentQuestionIndex+1} of {questions.length} questions
        </div>
    </div>
  )
}

export default Quiz