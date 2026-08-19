package ar.edu.unsam.phm.controllers

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

// No toca DB/Redis: pensado para monitores externos (UptimeRobot) y el health check de Render,
// para que el wakeup del free-tier no dependa de que Postgres también responda.
@RestController
@RequestMapping("/api/health")
class HealthController {

    @GetMapping
    fun health(): Map<String, String> = mapOf("status" to "ok")
}
