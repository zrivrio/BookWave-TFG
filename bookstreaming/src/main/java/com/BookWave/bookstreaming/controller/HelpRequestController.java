package com.BookWave.bookstreaming.controller;

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
}