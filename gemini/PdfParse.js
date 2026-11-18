// server.js
import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
const pdfProcessor = await import('./pdfProcessor.cjs');
const { processPdf } = pdfProcessor;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure Gemini API
const API_KEY = process.env.GEMINI_API_KEY; // Replace with your actual API key
const genAI = new GoogleGenerativeAI(API_KEY);

// Function to process PDF file
// async function processPdf(filePath) {
//   const dataBuffer = fs.readFileSync(filePath);
//   const data = await pdfParse(dataBuffer);
//   return data.text;
// }

// Function to analyze text with Gemini
async function analyzeTextWithGemini(text) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  
  const prompt = `
    You are a medical assistant. Analyze the following patient document text and:
    1. Identify potential diseases or conditions mentioned
    2. List key symptoms described
    3. Highlight any concerning medical factors
    4. Provide related medical information that might be relevant
    
    Patient document text:
    ${text}
    
    Format your response as JSON with the following structure:
    {
      "potentialConditions": [],
      "keySymptoms": [],
      "concerningFactors": [],
      "relatedInfo": []
    }
  `;
  
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}



export const analysePDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    const filePath = req.file.path;
    
    // Extract text from PDF
    const extractedText = await processPdf(filePath);
    
    // Analyze text with Gemini
    const analysisText = await analyzeTextWithGemini(extractedText);
    const cleanResponse = analysisText.replace(/```json\n|\n```/g, "").trim();
    let analysis;
    
    try {
      analysis = JSON.parse(cleanResponse);
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      analysis = { 
        error: 'Could not parse Gemini response',
        rawResponse: analysisText
      };
    }
    
    // Handle file storage based on request parameter
    const storeFile = req.body.storeFile === 'true';
    if (!storeFile) {
      fs.unlinkSync(filePath);
    }
    
    res.json({
      success: true,
      fileStored: storeFile,
      fileName: req.file.originalname,
      analysis
    });
    
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({
      success: false,
      message: `Error processing file: ${error.message}`
    });
  }
};