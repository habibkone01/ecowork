describe('Scénario 2 — Réservation complète', () => {
  beforeEach(() => {
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

  it('permet de réserver un espace et affiche le prix correct', () => {
    cy.visit('/espaces')
    cy.wait(800)

    cy.contains('a', "Voir l'espace").first().click()
    cy.wait(800)

    const dateDebut = new Date()
    dateDebut.setDate(dateDebut.getDate() + 10)
    const dateFin = new Date()
    dateFin.setDate(dateFin.getDate() + 12)
    const format = (d) => d.toISOString().split('T')[0]

    cy.get('input[type="date"]').first().type(format(dateDebut), { delay: 100 })
    cy.wait(500)
    cy.get('input[type="date"]').last().type(format(dateFin), { delay: 100 })
    cy.wait(500)

    cy.contains('Total').should('be.visible')
    cy.wait(500)

    cy.contains('button', 'Réserver cet espace').click()
    cy.wait(1000)

    cy.contains('Réservation confirmée !').should('be.visible')
    cy.contains('Votre réservation a été enregistrée avec succès.').should('be.visible')

    cy.contains('a', 'Mes réservations').click({ force: true })
    cy.wait(500)
    cy.url().should('include', '/reservations')
  })
})