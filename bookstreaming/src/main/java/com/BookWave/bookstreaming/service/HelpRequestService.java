package com.BookWave.bookstreaming.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.BookWave.bookstreaming.repository.HelpRequestRepository;
import com.BookWave.bookstreaming.repository.UserRepository;
import com.BookWave.bookstreaming.domain.HelpRequest;
import com.BookWave.bookstreaming.domain.User;
import java.util.Date;
import java.util.List;

@Service
public class HelpRequestService {
    @Autowired
    private HelpRequestRepository helpRequestRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public HelpRequest create(HelpRequest helpRequest) {
        User user = userRepository.findById(helpRequest.getUser().getId())
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            
        helpRequest.setUser(user);
        helpRequest.setCreatedAt(new Date());
        helpRequest.setResolved(false);
        return helpRequestRepository.save(helpRequest);
    }

    //Métodos de Administrador
    public List<HelpRequest> getAllHelpRequests() {
        return helpRequestRepository.findAll();
    }

    public HelpRequest getHelpRequestById(Long id) {
        return helpRequestRepository.findById(id).orElse(null);
    }

    public void deleteHelpRequest(Long id) {
        helpRequestRepository.deleteById(id);
    }

    public HelpRequest updateHelpRequest(HelpRequest helpRequest) {
        return helpRequestRepository.save(helpRequest);
    }
}