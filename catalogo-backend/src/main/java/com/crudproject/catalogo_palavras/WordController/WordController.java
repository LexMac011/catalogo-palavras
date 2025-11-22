package com.crudproject.catalogo_palavras.WordController;

import com.crudproject.catalogo_palavras.model.Word;
import com.crudproject.catalogo_palavras.repository.WordRepository;
import com.crudproject.catalogo_palavras.exception.ResourceNotFoundException;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/words")
@CrossOrigin(origins = "*")
public class WordController {
	
	@Autowired
	private WordRepository wordRepository;
	
	// POST endpoint
	@PostMapping
	public ResponseEntity<Word> createWord(@RequestBody Word word) {
		Word savedWord = wordRepository.save(word);
		
		return ResponseEntity.ok(savedWord);
	}
	// GET endpoint
	@GetMapping
	public ResponseEntity<List<Word>> getAllWords() {
		List<Word> words = wordRepository.findAll();
		
		return ResponseEntity.ok(words);
	}
	
	// DELETE endpoint
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteWord(@PathVariable Long id) {
		wordRepository.deleteById(id);
		
		return ResponseEntity.noContent().build();
	}
	
	// PUT endpoint
	@PutMapping("/{id}")
	public ResponseEntity<Word> updateWord(@PathVariable Long id, @RequestBody Word wordDetails) {
		Word word = wordRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Palavra não encontrada para o id:: " + id));
		
		// atualizando nos atributos do objeto
		word.setTerm(wordDetails.getTerm());
        word.setDefinition(wordDetails.getDefinition());
        
        Word updatedWord = wordRepository.save(word);
        
        return ResponseEntity.ok(updatedWord);
	}
	
}
