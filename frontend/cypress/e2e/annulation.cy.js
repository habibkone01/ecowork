describe('Scénario 3 — Annulation réservation', () => {
  beforeEach(() => {
    cy.viewport(1280, 720)
    cy.visit('/login')
    cy.wait(500)
    cy.get('input[type="email"]').type('guyjosephboathiemele@gmail.com', { delay: 100 })
    cy.wait(300)
    cy.get('input[type="password"]').type('mamana123', { delay: 100 })
    cy.wait(300)
    cy.contains('button', 'Se connecter').click()
    cy.wait(1000)
    cy.url().should('include', '/espaces')
  })

  it('permet d\'annuler une réservation confirmée', () => {
    cy.visit('/reservations')
    cy.wait(800)

    cy.contains('button', 'Annuler').first().click()
    cy.wait(500)

    cy.contains('button', 'Annuler la réservation').click()
    cy.wait(1000)

    cy.contains('Annulée').should('be.visible')
  })
})