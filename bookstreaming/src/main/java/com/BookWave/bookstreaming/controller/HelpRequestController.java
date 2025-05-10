package com.BookWave.bookstreaming.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.BookWave.bookstreaming.domain.HelpRequest;
import com.BookWave.bookstreaming.service.HelpRequestService;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/help")
public class HelpRequestController {
    @Autowired
    private HelpRequestService helpRequestService;

    @PostMapping()
    public HelpRequest createHelpRequest(@RequestBody HelpRequest helpRequest) {
        return helpRequestService.create(helpRequest);
    }

    @GetMapping("/user/{userId}")
public List<HelpRequest> getHelpRequestsByUser(@PathVariable Long userId) {
    return helpRequestService.getHelpRequestsByUser(userId);
}

    //Métodos de Administrador
    @GetMapping("/admin")
    public List<HelpRequest> getAllHelpRequests() {
        return helpRequestService.getAllHelpRequests();
    }

    @GetMapping("/admin/{id}")
    public HelpRequest getHelpRequestById(@PathVariable Long id) {
        return helpRequestService.getHelpRequestById(id);
    }

    @DeleteMapping("/admin/{id}")
    public void deleteHelpRequest(@PathVariable Long id) {
        helpRequestService.deleteHelpRequest(id);
    }

    @PutMapping("/admin")
    public HelpRequest updateHelpRequest(@RequestBody HelpRequest helpRequest) {
        return helpRequestService.updateHelpRequest(helpRequest);
    }
}