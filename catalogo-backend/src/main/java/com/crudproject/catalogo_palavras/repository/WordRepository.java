package com.crudproject.catalogo_palavras.repository;

import com.crudproject.catalogo_palavras.model.Word;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface WordRepository extends JpaRepository<Word, Long> {
}
